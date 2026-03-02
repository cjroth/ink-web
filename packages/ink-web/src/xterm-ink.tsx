import { FitAddon } from '@xterm/addon-fit'
import { render } from 'ink'
import React from 'react'
import { Terminal, type ITerminalOptions } from 'xterm'
import { Readable, Writable } from './shims/stream'
import { FILE_DROP_EVENT, type DroppedFile } from './file-drop'
import './shims/timers'

// Helper to check if yoga init is available
const getYogaInit = (): Promise<void> => {
  if (typeof globalThis !== 'undefined' && (globalThis as any).__yogaPromise) {
    return (globalThis as any).__yogaPromise.then(() => undefined)
  }
  return Promise.resolve()
}

export interface InkWebOptions {
  termOptions?: ITerminalOptions
  container: HTMLElement
  focus?: boolean
  onReady?: () => void
  /** @internal Override the render function (used for testing) */
  _render?: typeof render
}

export function mountInkInXterm(element: React.ReactElement, opts: InkWebOptions) {
  const renderFn = opts._render ?? render
  const containerWidth = opts.container.clientWidth
  const containerHeight = opts.container.clientHeight

  const charWidth = 9
  const charHeight = 17
  const initialCols = Math.floor(containerWidth / charWidth) || 80
  const initialRows = Math.floor(containerHeight / charHeight) || 24

  const term = new Terminal({
    convertEol: true,
    disableStdin: false,
    cols: initialCols,
    rows: initialRows,
    ...opts.termOptions,
  })
  const fitAddon = new FitAddon()

  term.open(opts.container)
  term.loadAddon(fitAddon)

  // Hide the native xterm.js cursor — ink components render their own
  term.write('\x1b[?25l')

  if (opts.focus !== false) {
    setTimeout(() => {
      try {
        term.focus()
      } catch (e) {
        console.warn('Error focusing terminal:', e)
      }
    }, 100)
  }

  // Create stdout stream that writes into xterm.
  //
  // Ink has a code path that fires clearTerminal (\x1b[2J\x1b[3J\x1b[H) when
  // the rendered output exceeds terminal rows, then rewrites everything.
  // In xterm.js this causes a full-screen flash because the clear and redraw
  // are rendered in separate animation frames.
  //
  // Fix: strip clearTerminal sequences and replace with a cursor-home so the
  // new content overwrites in place without a visible blank frame.
  const CLEAR_TERMINAL = '\x1b[2J\x1b[3J\x1b[H'
  const CURSOR_HOME = '\x1b[H'
  const stdoutBase = new Writable()
  stdoutBase.write = (chunk: unknown, encoding?: any, cb?: any) => {
    let str = typeof chunk === 'string' ? chunk : String(chunk)
    if (str.length > 0) {
      if (str.includes(CLEAR_TERMINAL)) {
        str = str.replace(CLEAR_TERMINAL, CURSOR_HOME)
      }
      term.write(str)
    }
    if (typeof encoding === 'function') {
      encoding()
    } else if (cb) {
      cb()
    }
    return true
  }

  const stdout = Object.assign(stdoutBase, {
    columns: term.cols,
    rows: term.rows,
    isTTY: true,
    writable: true,
    setDefaultEncoding: (_enc: string) => stdout,
    cork: () => {},
    uncork: () => {},
  }) as unknown as NodeJS.WriteStream

  // Create stdin stream that emits data from xterm keystrokes
  const stdinBase = new Readable()
  const inputBuffer: string[] = []
  const stdin = Object.assign(stdinBase, {
    columns: term.cols,
    rows: term.rows,
    isTTY: true,
    setEncoding: (_enc?: string) => {},
    setRawMode: (_raw?: boolean) => {},
    resume: () => {},
    pause: () => {},
    ref: () => {},
    unref: () => {},
    read: () => {
      return inputBuffer.length > 0 ? inputBuffer.shift()! : null
    },
  }) as unknown as NodeJS.ReadStream

  term.onData((data) => {
    inputBuffer.push(data)
    ;(stdin as unknown as { emit: (event: string) => void }).emit('readable')
  })

  // File drop support
  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const onDrop = async (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer?.files
    if (!files || files.length === 0) return
    for (const file of Array.from(files)) {
      try {
        const content = await file.text()
        const dropped: DroppedFile = {
          name: file.name,
          content,
          type: file.type,
          size: file.size,
        }
        ;(stdin as unknown as { emit: (event: string, ...args: unknown[]) => void }).emit(
          FILE_DROP_EVENT,
          dropped
        )
      } catch (err) {
        console.warn('Error reading dropped file:', err)
      }
    }
  }
  opts.container.addEventListener('dragover', onDragOver)
  opts.container.addEventListener('drop', onDrop)

  const updateStreamsSize = () => {
    const cols = term.cols
    const rows = term.rows
    ;(stdout as unknown as { columns: number; rows: number }).columns = cols
    ;(stdout as unknown as { columns: number; rows: number }).rows = rows
    ;(stdin as unknown as { columns: number; rows: number }).columns = cols
    ;(stdin as unknown as { columns: number; rows: number }).rows = rows
    ;(stdout as unknown as { emit: (event: string) => void }).emit('resize')
  }

  updateStreamsSize()

  let instance: any
  let pendingElement: React.ReactElement = element

  getYogaInit()
    .then(() => {
      instance = renderFn(pendingElement, {
        stdout,
        stderr: stdout,
        stdin,
        patchConsole: false,
        incrementalRendering: true,
      })
    })
    .catch((e: Error) => {
      console.error('Error initializing Yoga or rendering Ink:', e)
    })

  // Resize handling — when xterm.js narrows, it reflows existing content to
  // the new width which garbles box-drawing characters and pushes wrapped
  // lines into scrollback.  We fix this by resetting Ink's log state and
  // clearing the terminal before emitting 'resize'.
  //
  // We only clear on SHRINK, not expand.  Ink's resize handler resets
  // lastOutput only when narrowing, so a clear + re-render works atomically.
  // On expand, Ink does NOT reset lastOutput — clearing would leave the
  // screen blank when the rendered output string hasn't changed.
  const resize = () => {
    try {
      if ((term as any)._core?.viewport && (term as any)._core?._renderService?._renderer?.value) {
        fitAddon.fit()
        const cols = term.cols
        const rows = term.rows
        if (cols !== (stdout as any).columns || rows !== (stdout as any).rows) {
          const isNarrowing = cols < (stdout as any).columns
          if (isNarrowing) {
            // Only clear on shrink — xterm.js reflow when narrowing garbles
            // box-drawing characters.  Ink's own resize handler already resets
            // lastOutput when narrowing, so the re-render after our clear will
            // always produce output.  On expand, Ink does NOT reset lastOutput,
            // so clearing here would leave the screen blank when the rendered
            // string hasn't changed.
            if (instance) {
              instance.clear()
            }
            term.write('\x1b[2J\x1b[3J\x1b[H')
          }
          updateStreamsSize()
        }
      }
    } catch {
      // fitAddon.fit() can throw if xterm's renderer isn't ready yet;
      // the ResizeObserver or next resize event will retry.
    }
  }

  const ro = new ResizeObserver(() => resize())
  ro.observe(opts.container)
  const onWindowResize = () => resize()
  window.addEventListener('resize', onWindowResize)

  setTimeout(() => {
    resize()
    opts.onReady?.()
  }, 200)

  return {
    term,
    rerender: (newElement: React.ReactElement) => {
      pendingElement = newElement
      if (instance) {
        instance.rerender(newElement)
      }
    },
    unmount: async () => {
      try {
        if (instance) {
          instance.unmount()
        }
      } finally {
        try {
          ro.disconnect()
        } catch {}
        window.removeEventListener('resize', onWindowResize)
        opts.container.removeEventListener('dragover', onDragOver)
        opts.container.removeEventListener('drop', onDrop)
        term.dispose()
      }
    },
  }
}
