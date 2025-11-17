import { FitAddon } from '@xterm/addon-fit'
import { render } from 'ink'
import React from 'react'
import { Terminal, type ITerminalOptions } from 'xterm'
import { Readable, Writable } from './shims/stream'

export interface InkBrowserOptions {
  termOptions?: ITerminalOptions
  container: HTMLElement
  focus?: boolean
}

//

export function mountInkInXterm(element: React.ReactElement, opts: InkBrowserOptions) {
  const term = new Terminal({ convertEol: true, disableStdin: false, ...opts.termOptions })
  term.open(opts.container)
  const fitAddon = new FitAddon()
  term.loadAddon(fitAddon)
  fitAddon.fit()
  if (opts.focus !== false) term.focus()

  // Create stdout stream that writes into xterm
  const stdoutBase = new Writable()
  const stdout = Object.assign(stdoutBase, {
    columns: term.cols,
    rows: term.rows,
    isTTY: true,
    write: (str: string) => {
      term.write(str)
      return true
    },
    setDefaultEncoding: (_enc: string) => stdoutBase,
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

  const updateStreamsSize = () => {
    const cols = term.cols
    const rows = term.rows
    ;(stdout as unknown as { columns: number; rows: number }).columns = cols
    ;(stdout as unknown as { columns: number; rows: number }).rows = rows
    ;(stdin as unknown as { columns: number; rows: number }).columns = cols
    ;(stdin as unknown as { columns: number; rows: number }).rows = rows
    ;(stdout as unknown as { emit: (event: string) => void }).emit('resize')
  }

  const resize = () => {
    fitAddon.fit()
    updateStreamsSize()
  }

  // Observe container size changes
  const ro = new ResizeObserver(() => {
    resize()
  })
  ro.observe(opts.container)

  // Also listen to window resize as a fallback
  const onWindowResize = () => resize()
  window.addEventListener('resize', onWindowResize)

  // Update sizes after initial fit
  updateStreamsSize()

  const instance = render(element, { stdout, stderr: stdout, stdin, patchConsole: false, debug: false })

  return {
    term,
    unmount: async () => {
      try {
        instance.unmount()
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
