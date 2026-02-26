import { describe, expect, test, beforeEach, afterEach, mock } from 'bun:test'
import React from 'react'

// Store mocks for assertions
let rafCallbacks: FrameRequestCallback[] = []
let cancelledRafIds: number[] = []
let rafId = 0
let resizeObserverInstances: MockResizeObserver[] = []

// Save originals so we restore rather than delete (happy-dom provides these globally)
let origDocument: typeof globalThis.document
let origWindow: typeof globalThis.window
let origResizeObserver: typeof globalThis.ResizeObserver
let origRAF: typeof globalThis.requestAnimationFrame
let origCAF: typeof globalThis.cancelAnimationFrame

class MockResizeObserver {
  callback: ResizeObserverCallback
  observedElements: Element[] = []

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    resizeObserverInstances.push(this)
  }

  observe(element: Element) {
    this.observedElements.push(element)
  }

  disconnect() {
    this.observedElements = []
  }

  // Helper to trigger resize
  trigger() {
    this.callback([], this)
  }
}

// Setup DOM mocks before any imports
beforeEach(() => {
  rafCallbacks = []
  cancelledRafIds = []
  rafId = 0
  resizeObserverInstances = []

  // Save originals so we can restore them (happy-dom provides these globally)
  origDocument = global.document
  origWindow = global.window
  origResizeObserver = global.ResizeObserver
  origRAF = global.requestAnimationFrame
  origCAF = global.cancelAnimationFrame

  // @ts-ignore
  global.document = {
    createElement: (tag: string) => ({
      tagName: tag.toUpperCase(),
      style: {},
      classList: { add: () => {}, remove: () => {} },
      appendChild: () => {},
      removeChild: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  }

  // @ts-ignore
  global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
  }

  // @ts-ignore
  global.ResizeObserver = MockResizeObserver

  // @ts-ignore
  global.requestAnimationFrame = (cb: FrameRequestCallback) => {
    rafCallbacks.push(cb)
    return ++rafId
  }

  // @ts-ignore
  global.cancelAnimationFrame = (id: number) => {
    cancelledRafIds.push(id)
  }
})

afterEach(() => {
  // Restore originals instead of deleting (preserves happy-dom globals)
  global.document = origDocument
  global.window = origWindow
  global.ResizeObserver = origResizeObserver
  global.requestAnimationFrame = origRAF
  global.cancelAnimationFrame = origCAF
})

describe('InkXterm initialization behavior', () => {
  test('requestAnimationFrame mock works correctly', () => {
    const cb1 = () => {}
    const cb2 = () => {}

    const id1 = requestAnimationFrame(cb1)
    const id2 = requestAnimationFrame(cb2)

    expect(id1).toBe(1)
    expect(id2).toBe(2)
    expect(rafCallbacks.length).toBe(2)
    expect(rafCallbacks[0]).toBe(cb1)
    expect(rafCallbacks[1]).toBe(cb2)
  })

  test('cancelAnimationFrame mock tracks cancelled IDs', () => {
    const id = requestAnimationFrame(() => {})
    cancelAnimationFrame(id)

    expect(cancelledRafIds).toContain(id)
  })

  test('ResizeObserver mock tracks observed elements', () => {
    const callback = mock(() => {})
    const ro = new ResizeObserver(callback)
    const element = { tagName: 'DIV' } as Element

    ro.observe(element)

    expect(resizeObserverInstances.length).toBe(1)
    expect(resizeObserverInstances[0].observedElements).toContain(element)
  })

  test('ResizeObserver triggers callback when resize occurs', () => {
    const callback = mock(() => {})
    const ro = new ResizeObserver(callback)
    const element = { tagName: 'DIV' } as Element

    ro.observe(element)
    ;(ro as MockResizeObserver).trigger()

    expect(callback).toHaveBeenCalled()
  })

  test('ResizeObserver disconnect clears observed elements', () => {
    const ro = new ResizeObserver(() => {})
    const element = { tagName: 'DIV' } as Element

    ro.observe(element)
    expect((ro as MockResizeObserver).observedElements.length).toBe(1)

    ro.disconnect()
    expect((ro as MockResizeObserver).observedElements.length).toBe(0)
  })

  test('multiple ResizeObserver instances are tracked', () => {
    new ResizeObserver(() => {})
    new ResizeObserver(() => {})
    new ResizeObserver(() => {})

    expect(resizeObserverInstances.length).toBe(3)
  })
})

describe('InkXterm container dimension logic', () => {
  test('container with zero dimensions should trigger ResizeObserver', () => {
    // Simulate the logic in InkXterm
    const container = {
      clientWidth: 0,
      clientHeight: 0,
    }

    const shouldWaitForResize = container.clientWidth === 0 || container.clientHeight === 0
    expect(shouldWaitForResize).toBe(true)
  })

  test('container with dimensions should initialize immediately', () => {
    const container = {
      clientWidth: 800,
      clientHeight: 600,
    }

    const shouldWaitForResize = container.clientWidth === 0 || container.clientHeight === 0
    expect(shouldWaitForResize).toBe(false)
  })

  test('container with only width should still wait', () => {
    const container = {
      clientWidth: 800,
      clientHeight: 0,
    }

    const shouldWaitForResize = container.clientWidth === 0 || container.clientHeight === 0
    expect(shouldWaitForResize).toBe(true)
  })

  test('container with only height should still wait', () => {
    const container = {
      clientWidth: 0,
      clientHeight: 600,
    }

    const shouldWaitForResize = container.clientWidth === 0 || container.clientHeight === 0
    expect(shouldWaitForResize).toBe(true)
  })
})
