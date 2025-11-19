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

  // Override the write method to intercept all terminal output
  stdoutBase.write = (chunk: unknown, encoding?: any, cb?: any) => {
    const str = typeof chunk === 'string' ? chunk : String(chunk)

    console.log('✍️ stdout.write() called with:', JSON.stringify(str.substring(0, 100)))

    // Log line lengths for each row
    const lines = str.split('\n')
    lines.forEach((line, index) => {
      // Remove ANSI escape codes to get actual text length
      const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '')
      console.log(`Row ${index} text length: ${cleanLine.length} chars`)
    })

    term.write(str)

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
    writable: true,
    setDefaultEncoding: (_enc: string) => stdout,
    cork: () => {},
    uncork: () => {},
  }) as unknown as NodeJS.WriteStream

  console.log('📊 stdout properties:', {
    isTTY: stdout.isTTY,
    writable: (stdout as any).writable,
    columns: stdout.columns,
    rows: stdout.rows,
    hasWrite: typeof stdout.write === 'function',
  })

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

  // Wrap stdout.write to see ALL calls
  const originalWrite = stdout.write.bind(stdout)
  let writeCallCount = 0
  stdout.write = (chunk: any, encoding?: any, cb?: any) => {
    writeCallCount++
    console.log(`📞 stdout.write called (call #${writeCallCount})`)
    return originalWrite(chunk, encoding, cb)
  }

  console.log('⚙️ Checking yoga initialization...')
  console.log('⚙️ globalThis.__yogaPromise exists:', typeof (globalThis as any).__yogaPromise !== 'undefined')

  getYogaInit()
    .then(() => {
      console.log('✅ Yoga init promise resolved')

      // Add a delay to ensure yoga WASM is fully ready and all properties are copied
      return new Promise((resolve) => setTimeout(resolve, 500))
    })
    .then(async () => {
      console.log('🎨 About to call Ink render() with element:', element)
      console.log('🎨 Element type:', element.type)
      console.log('🎨 Element props:', element.props)

      // Force a small delay to ensure everything is ready
      await new Promise((resolve) => setTimeout(resolve, 100))

      instance = render(element, {
        stdout,
        stderr: stdout,
        stdin,
        patchConsole: false,
        debug: true, // Enable debug mode to bypass logUpdate throttling
      })

      console.log('✅ Ink render() returned instance:', instance)
      console.log('🔍 stdout dimensions for Ink:', {
        columns: stdout.columns,
        rows: stdout.rows,
        isTTY: stdout.isTTY,
      })

      // Test if stdout.write works at all
      setTimeout(() => {
        console.log('🧪 Manual test: calling stdout.write directly...')
        stdout.write('MANUAL TEST 1\n')
      }, 200)

      // Try to force stdout resize event to trigger layout calculation
      setTimeout(() => {
        console.log('🔄 Emitting resize event on stdout...')
        ;(stdout as any).emit('resize')
      }, 300)

      // Force a re-render to trigger output
      setTimeout(() => {
        console.log('🔄 Calling instance.rerender()...')
        instance.rerender(element)
      }, 500)

      // Another manual test after rerender
      setTimeout(() => {
        console.log('🧪 Manual test 2: calling stdout.write after rerender...')
        stdout.write('MANUAL TEST 2\n')
      }, 700)
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
