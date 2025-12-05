import { GlobalRegistrator } from '@happy-dom/global-registrator'
import type { RenderOptions, Instance } from 'ink'
import { render } from 'ink'
import type { ReactNode } from 'react'

/**
 * Mock WriteStream that captures output for testing
 */
export interface MockWriteStream extends NodeJS.WriteStream {
  writes: string[]
  output: () => string
}

/**
 * Mock ReadStream for stdin
 */
export interface MockReadStream extends NodeJS.ReadStream {
  listeners: Record<string, ((...args: unknown[]) => void)[]>
}

/**
 * Create a mock WriteStream that captures all writes
 */
export function createMockWriteStream(): MockWriteStream {
  const writes: string[] = []
  const listeners: Record<string, ((...args: unknown[]) => void)[]> = {}

  const stream = {
    writes,
    columns: 80,
    rows: 24,
    isTTY: true,
    writable: true,
    output: () => writes.join(''),
    write(str: string | Uint8Array, encodingOrCb?: BufferEncoding | ((err?: Error) => void), cb?: (err?: Error) => void): boolean {
      const data = typeof str === 'string' ? str : str.toString()
      writes.push(data)
      const callback = typeof encodingOrCb === 'function' ? encodingOrCb : cb
      if (callback) callback()
      return true
    },
    on(event: string, handler: (...args: unknown[]) => void) {
      if (!listeners[event]) listeners[event] = []
      listeners[event].push(handler)
      return stream
    },
    off(event: string, handler: (...args: unknown[]) => void) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((h) => h !== handler)
      }
      return stream
    },
    once(event: string, handler: (...args: unknown[]) => void) {
      const wrapper = (...args: unknown[]) => {
        stream.off(event, wrapper)
        handler(...args)
      }
      return stream.on(event, wrapper)
    },
    emit(event: string, ...args: unknown[]) {
      if (listeners[event]) {
        listeners[event].forEach((handler) => handler(...args))
      }
      return true
    },
    addListener(event: string, handler: (...args: unknown[]) => void) {
      return stream.on(event, handler)
    },
    removeListener(event: string, handler: (...args: unknown[]) => void) {
      return stream.off(event, handler)
    },
    removeAllListeners(event?: string) {
      if (event) {
        delete listeners[event]
      } else {
        Object.keys(listeners).forEach((key) => delete listeners[key])
      }
      return stream
    },
    setMaxListeners() {
      return stream
    },
    getMaxListeners() {
      return 10
    },
    listeners(event: string) {
      return listeners[event] || []
    },
    rawListeners(event: string) {
      return listeners[event] || []
    },
    listenerCount(event: string) {
      return (listeners[event] || []).length
    },
    prependListener(event: string, handler: (...args: unknown[]) => void) {
      if (!listeners[event]) listeners[event] = []
      listeners[event].unshift(handler)
      return stream
    },
    prependOnceListener(event: string, handler: (...args: unknown[]) => void) {
      const wrapper = (...args: unknown[]) => {
        stream.off(event, wrapper)
        handler(...args)
      }
      return stream.prependListener(event, wrapper)
    },
    eventNames() {
      return Object.keys(listeners)
    },
    setDefaultEncoding() {
      return stream
    },
    cork() {},
    uncork() {},
    end() {
      return stream
    },
    destroy() {
      return stream
    },
    pipe() {
      return stream as unknown as NodeJS.WriteStream
    },
    compose() {
      throw new Error('Not implemented')
    },
    // Required WriteStream properties
    bytesWritten: 0,
    close() {},
    // Required tty.WriteStream properties
    clearLine() {
      return true
    },
    clearScreenDown() {
      return true
    },
    cursorTo() {
      return true
    },
    moveCursor() {
      return true
    },
    getColorDepth() {
      return 24
    },
    hasColors() {
      return true
    },
    getWindowSize(): [number, number] {
      return [80, 24]
    },
  }

  return stream as unknown as MockWriteStream
}

/**
 * Create a mock ReadStream for stdin
 */
export function createMockReadStream(): MockReadStream {
  const listeners: Record<string, ((...args: unknown[]) => void)[]> = {}

  const stream = {
    listeners,
    isTTY: true,
    isRaw: false,
    readable: true,
    setRawMode(mode: boolean) {
      stream.isRaw = mode
      return stream
    },
    on(event: string, handler: (...args: unknown[]) => void) {
      if (!listeners[event]) listeners[event] = []
      listeners[event].push(handler)
      return stream
    },
    off(event: string, handler: (...args: unknown[]) => void) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((h) => h !== handler)
      }
      return stream
    },
    once(event: string, handler: (...args: unknown[]) => void) {
      const wrapper = (...args: unknown[]) => {
        stream.off(event, wrapper)
        handler(...args)
      }
      return stream.on(event, wrapper)
    },
    emit(event: string, ...args: unknown[]) {
      if (listeners[event]) {
        listeners[event].forEach((handler) => handler(...args))
      }
      return true
    },
    addListener(event: string, handler: (...args: unknown[]) => void) {
      return stream.on(event, handler)
    },
    removeListener(event: string, handler: (...args: unknown[]) => void) {
      return stream.off(event, handler)
    },
    removeAllListeners(event?: string) {
      if (event) {
        delete listeners[event]
      } else {
        Object.keys(listeners).forEach((key) => delete listeners[key])
      }
      return stream
    },
    setMaxListeners() {
      return stream
    },
    getMaxListeners() {
      return 10
    },
    listeners(event: string) {
      return listeners[event] || []
    },
    rawListeners(event: string) {
      return listeners[event] || []
    },
    listenerCount(event: string) {
      return (listeners[event] || []).length
    },
    prependListener(event: string, handler: (...args: unknown[]) => void) {
      if (!listeners[event]) listeners[event] = []
      listeners[event].unshift(handler)
      return stream
    },
    prependOnceListener(event: string, handler: (...args: unknown[]) => void) {
      const wrapper = (...args: unknown[]) => {
        stream.off(event, wrapper)
        handler(...args)
      }
      return stream.prependListener(event, wrapper)
    },
    eventNames() {
      return Object.keys(listeners)
    },
    pause() {
      return stream
    },
    resume() {
      return stream
    },
    read() {
      return null
    },
    setEncoding() {
      return stream
    },
    unpipe() {
      return stream
    },
    unshift() {},
    wrap() {
      return stream
    },
    pipe() {
      return stream as unknown as NodeJS.ReadStream
    },
    compose() {
      throw new Error('Not implemented')
    },
    destroy() {
      return stream
    },
    ref() {
      return stream
    },
    unref() {
      return stream
    },
    // Required stream properties
    readableEncoding: null,
    readableEnded: false,
    readableFlowing: null,
    readableHighWaterMark: 16384,
    readableLength: 0,
    readableObjectMode: false,
    destroyed: false,
  }

  return stream as unknown as MockReadStream
}

/**
 * Test render options with mocked streams
 */
export interface TestRenderResult {
  instance: Instance
  stdout: MockWriteStream
  stderr: MockWriteStream
  stdin: MockReadStream
  /** Wait for the initial render to complete */
  waitForRender: () => Promise<void>
  /** Wait for the next render after this call (useful for async state updates) */
  waitForNextRender: () => Promise<void>
  /** Unmount and cleanup */
  cleanup: () => void
}

/**
 * Render a component for testing with mocked streams.
 * Use `waitForRender()` to wait for renders instead of arbitrary timeouts.
 */
export function renderForTest(node: ReactNode, options?: Partial<RenderOptions>): TestRenderResult {
  const stdout = createMockWriteStream()
  const stderr = createMockWriteStream()
  const stdin = createMockReadStream()

  let renderResolve: (() => void) | null = null

  const instance = render(node, {
    stdout,
    stderr,
    stdin,
    patchConsole: false,
    debug: false,
    ...options,
    onRender: () => {
      options?.onRender?.({ renderTime: 0 })
      if (renderResolve) {
        renderResolve()
        renderResolve = null
      }
    },
  })

  const waitForRender = (): Promise<void> => {
    return new Promise((resolve) => {
      // If we already have output, resolve on next tick
      if (stdout.writes.length > 0) {
        Promise.resolve().then(resolve)
        return
      }
      renderResolve = resolve
    })
  }

  const waitForNextRender = (): Promise<void> => {
    return new Promise((resolve) => {
      renderResolve = resolve
    })
  }

  const cleanup = () => {
    instance.unmount()
  }

  return { instance, stdout, stderr, stdin, waitForRender, waitForNextRender, cleanup }
}

/**
 * Wait for a specified time (use sparingly, prefer waitForRender)
 */
export function wait(ms: number = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Setup happy-dom for browser-like environment.
 * Call this in beforeAll().
 */
export function setupHappyDom(): void {
  try {
    GlobalRegistrator.register()
  } catch {
    // Already registered
  }
}
