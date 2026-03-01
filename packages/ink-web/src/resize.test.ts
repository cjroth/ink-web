import { describe, test, expect, mock, beforeEach } from 'bun:test'
import React from 'react'

// --- Module-level state for mocks ---
let termWrites: string[] = []
let termCols = 80
let termRows = 24
let resizeObserverCallbacks: (() => void)[] = []
let inkClearCalled = false
let fitCallback: (() => void) | null = null

// --- Mock modules before importing xterm-ink ---

mock.module('xterm', () => ({
  Terminal: class MockTerminal {
    _core = {
      viewport: true,
      _renderService: { _renderer: { value: true } },
    }
    get cols() { return termCols }
    get rows() { return termRows }
    open() {}
    loadAddon() {}
    write(str: string) { termWrites.push(str) }
    focus() {}
    onData() { return { dispose: () => {} } }
    dispose() {}
  },
}))

mock.module('@xterm/addon-fit', () => ({
  FitAddon: class MockFitAddon {
    fit() { if (fitCallback) fitCallback() }
  },
}))

mock.module('ink', () => ({
  render: () => ({
    rerender: () => {},
    unmount: () => {},
    waitUntilExit: () => Promise.resolve(),
    clear: () => { inkClearCalled = true },
    cleanup: () => {},
  }),
  useStdin: () => ({ stdin: null, isRawModeSupported: false, setRawMode: () => {} }),
}))

// Capture ResizeObserver callbacks
globalThis.ResizeObserver = class MockResizeObserver {
  cb: () => void
  constructor(callback: ResizeObserverCallback) {
    this.cb = () => callback([], this as any)
  }
  observe() { resizeObserverCallbacks.push(this.cb) }
  disconnect() {}
  unobserve() {}
} as any

// Import after mocks are set up
const { mountInkInXterm } = await import('./xterm-ink')

const CLEAR_TERMINAL = '\x1b[2J\x1b[3J\x1b[H'

function createContainer() {
  const container = document.createElement('div')
  Object.defineProperty(container, 'clientWidth', { value: 800, configurable: true })
  Object.defineProperty(container, 'clientHeight', { value: 400, configurable: true })
  return container
}

describe('resize behavior', () => {
  beforeEach(() => {
    termWrites = []
    termCols = 80
    termRows = 24
    resizeObserverCallbacks = []
    inkClearCalled = false
    fitCallback = null
  })

  test('narrowing clears terminal and resets Ink state', async () => {
    const container = createContainer()
    const result = mountInkInXterm(React.createElement('div'), { container, focus: false })

    // Wait for async init (yoga promise + 200ms setTimeout)
    await new Promise(r => setTimeout(r, 300))
    termWrites = []
    inkClearCalled = false

    // Simulate narrowing: fitAddon.fit() changes cols from 80 → 60
    fitCallback = () => { termCols = 60 }
    resizeObserverCallbacks.forEach(cb => cb())

    expect(inkClearCalled).toBe(true)
    expect(termWrites).toContain(CLEAR_TERMINAL)

    await result.unmount()
  })

  test('expanding does NOT clear terminal or reset Ink state', async () => {
    const container = createContainer()
    const result = mountInkInXterm(React.createElement('div'), { container, focus: false })

    await new Promise(r => setTimeout(r, 300))
    termWrites = []
    inkClearCalled = false

    // Simulate expanding: fitAddon.fit() changes cols from 80 → 120
    fitCallback = () => { termCols = 120 }
    resizeObserverCallbacks.forEach(cb => cb())

    expect(inkClearCalled).toBe(false)
    expect(termWrites).not.toContain(CLEAR_TERMINAL)

    await result.unmount()
  })

  test('no-op when size has not changed', async () => {
    const container = createContainer()
    const result = mountInkInXterm(React.createElement('div'), { container, focus: false })

    await new Promise(r => setTimeout(r, 300))
    termWrites = []
    inkClearCalled = false

    // fitAddon.fit() does not change cols/rows — size stays the same
    fitCallback = () => {}
    resizeObserverCallbacks.forEach(cb => cb())

    expect(inkClearCalled).toBe(false)
    expect(termWrites).toEqual([])

    await result.unmount()
  })

  test('height-only shrink does not trigger clear (only width matters for reflow)', async () => {
    const container = createContainer()
    const result = mountInkInXterm(React.createElement('div'), { container, focus: false })

    await new Promise(r => setTimeout(r, 300))
    termWrites = []
    inkClearCalled = false

    // Cols stay the same, only rows decrease
    fitCallback = () => { termRows = 12 }
    resizeObserverCallbacks.forEach(cb => cb())

    // Size changed (rows differ) so updateStreamsSize is called,
    // but isNarrowing is false because cols didn't decrease
    expect(inkClearCalled).toBe(false)
    expect(termWrites).not.toContain(CLEAR_TERMINAL)

    await result.unmount()
  })
})
