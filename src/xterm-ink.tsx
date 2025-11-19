import { FitAddon } from '@xterm/addon-fit'
import { render } from 'ink'
import React from 'react'
import { Terminal, type ITerminalOptions } from 'xterm'
import { Readable, Writable } from './shims/stream'

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
}

//

export function mountInkInXterm(element: React.ReactElement, opts: InkWebOptions) {
  console.log('🚀 mountInkInXterm CALLED - This is the updated version with logging!')

  // Get container dimensions to set initial terminal size
  const containerWidth = opts.container.clientWidth
  const containerHeight = opts.container.clientHeight

  // Calculate initial cols/rows based on container size
  const charWidth = 9 // approximate char width in pixels
  const charHeight = 17 // approximate char height in pixels
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

  // Open terminal synchronously - Ink needs it immediately
  term.open(opts.container)
  term.loadAddon(fitAddon)

  // Focus if needed (delay to allow full initialization)
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

  // Listen to all possible events
  stdoutBase.on('data', (data) => {
    console.log('🔵 data event fired:', data)
  })

  // Override the write method
  stdoutBase.write = (chunk: unknown, encoding?: any, cb?: any) => {
    const str = typeof chunk === 'string' ? chunk : String(chunk)

    // Log line lengths for each row (always log, even for empty lines)
    console.log('=== Terminal Write Called ===')
    console.log('Raw output:', JSON.stringify(str))
    const lines = str.split('\n')
    console.log(`Total lines in this write: ${lines.length}`)
    lines.forEach((line, index) => {
      // Remove ANSI escape codes to get actual text length
      const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '')
      console.log(`Row ${index} text length: ${cleanLine.length} chars (raw: "${cleanLine}")`)
    })

    term.write(str)

    // Emit data event for compatibility
    stdoutBase.emit('data', str)

    if (typeof encoding === 'function') {
      encoding() // encoding is actually the callback
    } else if (cb) {
      cb()
    }
    return true
  }

  const stdout = Object.assign(stdoutBase, {
    columns: term.cols,
    rows: term.rows,
    isTTY: true,
    setDefaultEncoding: (_enc: string) => stdout,
    cork: () => {},
    uncork: () => {},
  }) as unknown as NodeJS.WriteStream

  console.log('📝 stdout object created with custom write function')
  console.log('📝 stdout.write is:', stdout.write)
  console.log('📝 stdout.columns:', stdout.columns, 'stdout.rows:', stdout.rows, 'stdout.isTTY:', stdout.isTTY)

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

  const updateStreamsSize = () => {
    const cols = term.cols
    const rows = term.rows
    ;(stdout as unknown as { columns: number; rows: number }).columns = cols
    ;(stdout as unknown as { columns: number; rows: number }).rows = rows
    ;(stdin as unknown as { columns: number; rows: number }).columns = cols
    ;(stdin as unknown as { columns: number; rows: number }).rows = rows
    ;(stdout as unknown as { emit: (event: string) => void }).emit('resize')
  }

  // Update sizes BEFORE rendering Ink
  updateStreamsSize()

  // Wait for yoga WASM to initialize before rendering
  let instance: any

  getYogaInit()
    .then(() => {
      console.log('✅ Yoga initialized, about to render Ink element')
      console.log('📝 Passing stdout to Ink:', stdout)
      console.log('📝 Element to render:', element)
      instance = render(element, {
        stdout,
        stderr: stdout,
        stdin,
        patchConsole: false,
        debug: true, // Enable debug mode
      })
      console.log('✅ Ink render() called, instance created:', instance)

      // Try manually triggering a write to test
      setTimeout(() => {
        console.log('🧪 Testing manual write to stdout...')
        stdout.write('TEST WRITE\n')
      }, 1000)
    })
    .catch((e: Error) => {
      console.error('Error initializing Yoga or rendering Ink:', e)
    })

  // Set up resize handling - only after Ink is rendered
  const resize = () => {
    try {
      // Only fit if the terminal has been properly initialized
      if ((term as any)._core?.viewport) {
        fitAddon.fit()
        updateStreamsSize()
      }
    } catch (e) {
      console.error('Error during resize:', e)
    }
  }

  // Observe container size changes
  const ro = new ResizeObserver(() => {
    resize()
  })
  ro.observe(opts.container)

  // Also listen to window resize as a fallback
  const onWindowResize = () => resize()
  window.addEventListener('resize', onWindowResize)

  // Try initial resize after a delay
  setTimeout(() => {
    resize()
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
        term.dispose()
      }
    },
  }
}
