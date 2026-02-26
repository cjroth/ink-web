import { FitAddon } from '@xterm/addon-fit'
import { render } from 'ink'
import React from 'react'
import { Terminal, type ITerminalOptions } from 'xterm'
import { Readable, Writable } from './shims/stream'
import { FILE_DROP_EVENT, type DroppedFile } from './file-drop'

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
}

export function mountInkInXterm(element: React.ReactElement, opts: InkWebOptions) {
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

  // Create stdout stream that writes into xterm
  const stdoutBase = new Writable()
  stdoutBase.write = (chunk: unknown, encoding?: any, cb?: any) => {
    const str = typeof chunk === 'string' ? chunk : String(chunk)
    if (str.length > 0) {
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

  getYogaInit()
    .then(() => {
      instance = render(element, {
        stdout,
        stderr: stdout,
        stdin,
        patchConsole: false,
      })
    })
    .catch((e: Error) => {
      console.error('Error initializing Yoga or rendering Ink:', e)
    })

  // Resize handling
  const resize = () => {
    try {
      if ((term as any)._core?.viewport) {
        fitAddon.fit()
        updateStreamsSize()
      }
    } catch (e) {
      console.error('Error during resize:', e)
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
