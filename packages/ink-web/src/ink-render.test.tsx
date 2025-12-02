import { describe, expect, test, beforeAll, afterEach } from 'bun:test'
import React from 'react'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { render as rtlRender, waitFor, act } from '@testing-library/react'

// Test helper to capture stdout writes
interface MockStdout {
  writes: string[]
  columns: number
  rows: number
  isTTY: boolean
  write: (str: string) => boolean
  on: (event: string, handler: (...args: any[]) => void) => void
  off: (event: string, handler: (...args: any[]) => void) => void
  emit: (event: string, ...args: any[]) => void
  setDefaultEncoding: (encoding: string) => MockStdout
  cork: () => void
  uncork: () => void
}

function createMockStdout(): MockStdout {
  const writes: string[] = []
  const listeners: Record<string, ((...args: any[]) => void)[]> = {}

  return {
    writes,
    columns: 80,
    rows: 24,
    isTTY: true,
    write: (str: string) => {
      writes.push(str)
      return true
    },
    on: (event: string, handler: (...args: any[]) => void) => {
      if (!listeners[event]) listeners[event] = []
      listeners[event].push(handler)
    },
    off: (event: string, handler: (...args: any[]) => void) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((h) => h !== handler)
      }
    },
    emit: (event: string, ...args: any[]) => {
      if (listeners[event]) {
        listeners[event].forEach((handler) => handler(...args))
      }
    },
    setDefaultEncoding: () => {
      return {} as MockStdout
    },
    cork: () => {},
    uncork: () => {},
  } as MockStdout
}

// Setup happy-dom for browser-like environment
beforeAll(() => {
  try {
    GlobalRegistrator.register()
  } catch (e) {
    // Already registered, ignore
  }
})

afterEach(() => {
  // Clean up any mounted instances
})

describe('Ink rendering in Node.js environment', () => {
  test('can import ink directly and render text', async () => {
    const { render, Text } = await import('ink')
    const mockStdout = createMockStdout()

    const element = React.createElement(Text, {}, 'Hello from Ink!')
    let instance: any

    await act(async () => {
      instance = render(element, {
        stdout: mockStdout as any,
        stderr: mockStdout as any,
        stdin: process.stdin as any,
        patchConsole: false,
        debug: false,
      })

      // Wait for render
      await new Promise((resolve) => setTimeout(resolve, 100))
    })

    // Verify text was written
    expect(mockStdout.writes.length).toBeGreaterThan(0)
    const allOutput = mockStdout.writes.join('')
    expect(allOutput).toContain('Hello from Ink!')

    act(() => {
      instance.unmount()
    })
  })

  test('can render Box with Text children', async () => {
    const { render, Box, Text } = await import('ink')
    const mockStdout = createMockStdout()

    const element = React.createElement(
      Box,
      { flexDirection: 'column' as const },
      React.createElement(Text, { color: 'green' }, 'Line 1'),
      React.createElement(Text, { color: 'blue' }, 'Line 2')
    )

    let instance: any

    await act(async () => {
      instance = render(element, {
        stdout: mockStdout as any,
        stderr: mockStdout as any,
        stdin: process.stdin as any,
        patchConsole: false,
        debug: false,
      })

      await new Promise((resolve) => setTimeout(resolve, 100))
    })

    expect(mockStdout.writes.length).toBeGreaterThan(0)
    const allOutput = mockStdout.writes.join('')
    expect(allOutput).toContain('Line 1')
    expect(allOutput).toContain('Line 2')

    act(() => {
      instance.unmount()
    })
  })
})

describe('Ink rendering via bundled in browser-like environment', () => {
  test('can import from bundled and get all exports', async () => {
    const mod = await import('./bundled')
    expect(mod.Box).toBeDefined()
    expect(mod.Text).toBeDefined()
    expect(mod.render).toBeDefined()
    expect(mod.InkTerminalBox).toBeDefined()
    expect(mod.mountInk).toBeDefined()
  })

  test('can render ink via bundled with Text component', async () => {
    const { render, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const element = React.createElement(Text, {}, 'Bundled Ink Test')
    let instance: any

    await act(async () => {
      instance = render(element, {
        stdout: mockStdout as any,
        stderr: mockStdout as any,
        stdin: process.stdin as any,
        patchConsole: false,
        debug: false,
      })

      await new Promise((resolve) => setTimeout(resolve, 200))
    })

    expect(mockStdout.writes.length).toBeGreaterThan(0)
    const allOutput = mockStdout.writes.join('')
    expect(allOutput.length).toBeGreaterThan(0)
    expect(allOutput).toContain('Bundled Ink Test')

    act(() => {
      instance.unmount()
    })
  })

  test('can render Box and Text from bundled', async () => {
    const { render, Box, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const element = React.createElement(
      Box,
      { flexDirection: 'column' as const, padding: 1 },
      React.createElement(Text, { bold: true }, 'Title'),
      React.createElement(Text, {}, 'Body text')
    )

    let instance: any

    await act(async () => {
      instance = render(element, {
        stdout: mockStdout as any,
        stderr: mockStdout as any,
        stdin: process.stdin as any,
        patchConsole: false,
        debug: false,
      })

      await new Promise((resolve) => setTimeout(resolve, 200))
    })

    expect(mockStdout.writes.length).toBeGreaterThan(0)
    const allOutput = mockStdout.writes.join('')
    expect(allOutput).toContain('Title')
    expect(allOutput).toContain('Body text')

    act(() => {
      instance.unmount()
    })
  })

  test('renders with InkTerminalBox in browser environment', async () => {
    const { InkTerminalBox, Text } = await import('./bundled')

    // Create a container element
    const container = document.createElement('div')
    container.style.width = '800px'
    container.style.height = '600px'
    document.body.appendChild(container)

    // Mock clientWidth/clientHeight on HTMLElement prototype since happy-dom doesn't compute layout
    // This is needed for InkTerminal to initialize properly (it checks dimensions of its inner div)
    const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
    const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { value: 800, configurable: true })
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { value: 600, configurable: true })

    // Mock canvas getContext since happy-dom doesn't support it and ghostty-web uses canvas
    const originalGetContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function(contextId: string) {
      if (contextId === '2d') {
        return {
          fillRect: () => {},
          clearRect: () => {},
          fillText: () => {},
          strokeRect: () => {},
          beginPath: () => {},
          moveTo: () => {},
          lineTo: () => {},
          stroke: () => {},
          fill: () => {},
          arc: () => {},
          rect: () => {},
          clip: () => {},
          save: () => {},
          restore: () => {},
          scale: () => {},
          translate: () => {},
          rotate: () => {},
          transform: () => {},
          setTransform: () => {},
          resetTransform: () => {},
          createLinearGradient: () => ({ addColorStop: () => {} }),
          createRadialGradient: () => ({ addColorStop: () => {} }),
          createPattern: () => null,
          measureText: () => ({ width: 10, actualBoundingBoxAscent: 12, actualBoundingBoxDescent: 3 }),
          getImageData: () => ({ data: new Uint8ClampedArray(0), width: 0, height: 0 }),
          putImageData: () => {},
          drawImage: () => {},
          canvas: this,
          font: '',
          fillStyle: '',
          strokeStyle: '',
          textBaseline: '',
          textAlign: '',
          lineWidth: 1,
          lineCap: '',
          lineJoin: '',
          globalAlpha: 1,
          globalCompositeOperation: '',
        } as unknown as CanvasRenderingContext2D
      }
      return null
    } as any

    // Render the component
    const TestApp = () =>
      React.createElement(
        InkTerminalBox,
        {
          focus: false,
          termOptions: {},
        },
        React.createElement(Text, {}, 'Terminal Box Test')
      )

    let unmountFn: () => void

    await act(async () => {
      const { unmount } = rtlRender(React.createElement(TestApp), {
        container,
      })
      unmountFn = unmount

      // Wait for requestAnimationFrame to fire and ghostty-web to initialize
      await new Promise((resolve) => setTimeout(resolve, 100))
    })

    // Wait for Ink to initialize and render
    await waitFor(
      () => {
        // Check if canvas element was created (ghostty-web uses canvas for rendering)
        const canvasElement = container.querySelector('canvas')
        expect(canvasElement).toBeTruthy()
      },
      { timeout: 3000 }
    )

    // Additional wait for Ink rendering
    await new Promise((resolve) => setTimeout(resolve, 500))

    const unmount = unmountFn!

    // Cleanup
    unmount()
    document.body.removeChild(container)

    // Restore original getContext
    HTMLCanvasElement.prototype.getContext = originalGetContext

    // Restore original clientWidth/clientHeight
    if (originalClientWidth) {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth)
    }
    if (originalClientHeight) {
      Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight)
    }
  })
})


describe('Yoga layout engine', () => {
  test('yogaNode is created when using bundled', async () => {
    const { render, Box } = await import('./bundled')
    const mockStdout = createMockStdout()

    const element = React.createElement(Box, {}, 'Test')
    let instance: any

    await act(async () => {
      instance = render(element, {
        stdout: mockStdout as any,
        stderr: mockStdout as any,
        stdin: process.stdin as any,
        patchConsole: false,
        debug: false,
      })

      await new Promise((resolve) => setTimeout(resolve, 200))
    })

    // Check that yogaNode was created by verifying non-empty output
    expect(mockStdout.writes.length).toBeGreaterThan(0)
    const allOutput = mockStdout.writes.join('')
    expect(allOutput.length).toBeGreaterThan(0)
    // Empty output would mean yogaNode was undefined

    act(() => {
      instance.unmount()
    })
  })

  test('layout calculations work correctly', async () => {
    const { render, Box, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    // Create a complex layout that requires yoga
    const element = React.createElement(
      Box,
      { flexDirection: 'row' as const, gap: 2 },
      React.createElement(Box, { width: 10 }, React.createElement(Text, {}, 'Left')),
      React.createElement(Box, { width: 10 }, React.createElement(Text, {}, 'Right'))
    )

    let instance: any

    await act(async () => {
      instance = render(element, {
        stdout: mockStdout as any,
        stderr: mockStdout as any,
        stdin: process.stdin as any,
        patchConsole: false,
        debug: false,
      })

      await new Promise((resolve) => setTimeout(resolve, 200))
    })

    expect(mockStdout.writes.length).toBeGreaterThan(0)
    const allOutput = mockStdout.writes.join('')
    expect(allOutput).toContain('Left')
    expect(allOutput).toContain('Right')

    act(() => {
      instance.unmount()
    })
  })
})
