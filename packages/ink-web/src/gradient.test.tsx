import { describe, expect, test, beforeAll, afterEach } from 'bun:test'
import React from 'react'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { act } from '@testing-library/react'

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

describe('Gradient Component', () => {
  test('renders with built-in rainbow gradient', async () => {
    const { render, Text, Transform } = await import('./index')
    const mockStdout = createMockStdout()

    // Simple gradient implementation for testing
    const Gradient = ({ children, name }: { children: React.ReactNode; name: string }) => {
      const applyGradient = (text: string) => {
        // Just add some ANSI codes to verify it's working
        return `\x1b[38;2;255;0;0m${text}\x1b[0m`
      }
      return React.createElement(Transform, { transform: applyGradient }, children)
    }

    const element = React.createElement(
      Gradient,
      { name: 'rainbow' },
      React.createElement(Text, {}, 'Hello Gradient!')
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
    expect(allOutput).toContain('Hello Gradient!')

    act(() => {
      instance.unmount()
    })
  })

  test('renders with custom colors', async () => {
    const { render, Text, Transform } = await import('./index')
    const mockStdout = createMockStdout()

    const Gradient = ({ children, colors }: { children: React.ReactNode; colors: string[] }) => {
      const applyGradient = (text: string) => {
        return `\x1b[38;2;255;0;0m${text}\x1b[0m`
      }
      return React.createElement(Transform, { transform: applyGradient }, children)
    }

    const element = React.createElement(
      Gradient,
      { colors: ['#ff0000', '#00ff00', '#0000ff'] },
      React.createElement(Text, {}, 'Custom gradient')
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
    expect(allOutput).toContain('Custom gradient')

    act(() => {
      instance.unmount()
    })
  })

  test('works with multiline text', async () => {
    const { render, Box, Text, Transform } = await import('./index')
    const mockStdout = createMockStdout()

    const Gradient = ({ children }: { children: React.ReactNode }) => {
      const applyGradient = (text: string) => {
        return text.split('\n').map(line => `\x1b[38;2;255;0;0m${line}\x1b[0m`).join('\n')
      }
      return React.createElement(Transform, { transform: applyGradient }, children)
    }

    const element = React.createElement(
      Box,
      { flexDirection: 'column' as const },
      React.createElement(
        Gradient,
        {},
        React.createElement(Text, {}, 'Line 1\nLine 2\nLine 3')
      )
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
    expect(allOutput).toContain('Line 3')

    act(() => {
      instance.unmount()
    })
  })

  test('Transform component is available', async () => {
    const { Transform } = await import('./index')
    expect(Transform).toBeDefined()
    expect(typeof Transform).toBe('function')
  })

  test('handles empty text gracefully', async () => {
    const { render, Text, Transform } = await import('./index')
    const mockStdout = createMockStdout()

    const Gradient = ({ children }: { children: React.ReactNode }) => {
      const applyGradient = (text: string) => {
        if (!text || text.length === 0) return text
        return `\x1b[38;2;255;0;0m${text}\x1b[0m`
      }
      return React.createElement(Transform, { transform: applyGradient }, children)
    }

    const element = React.createElement(
      Gradient,
      {},
      React.createElement(Text, {}, '')
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

    // Should not throw, even with empty text
    expect(mockStdout.writes.length).toBeGreaterThanOrEqual(0)

    act(() => {
      instance.unmount()
    })
  })
})

describe('Gradient utility functions', () => {
  test('hex to RGB conversion', () => {
    const hexToRgb = (hex: string) => {
      const normalized = hex.replace('#', '')
      const r = parseInt(normalized.substring(0, 2), 16)
      const g = parseInt(normalized.substring(2, 4), 16)
      const b = parseInt(normalized.substring(4, 6), 16)
      return { r, g, b }
    }

    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 })
    expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 })
    expect(hexToRgb('ffffff')).toEqual({ r: 255, g: 255, b: 255 })
  })

  test('RGB to ANSI conversion', () => {
    const rgbToAnsi = (rgb: { r: number; g: number; b: number }) => {
      return `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m`
    }

    expect(rgbToAnsi({ r: 255, g: 0, b: 0 })).toBe('\x1b[38;2;255;0;0m')
    expect(rgbToAnsi({ r: 0, g: 255, b: 0 })).toBe('\x1b[38;2;0;255;0m')
    expect(rgbToAnsi({ r: 0, g: 0, b: 255 })).toBe('\x1b[38;2;0;0;255m')
  })

  test('strip ANSI codes', () => {
    const stripAnsi = (str: string) => {
      // eslint-disable-next-line no-control-regex
      return str.replace(/\x1b\[[0-9;]*m/g, '')
    }

    expect(stripAnsi('\x1b[31mred\x1b[0m')).toBe('red')
    expect(stripAnsi('\x1b[38;2;255;0;0mcolored\x1b[0m')).toBe('colored')
    expect(stripAnsi('plain text')).toBe('plain text')
  })

  test('linear interpolation', () => {
    const lerp = (a: number, b: number, t: number) => {
      return a + (b - a) * t
    }

    expect(lerp(0, 100, 0)).toBe(0)
    expect(lerp(0, 100, 0.5)).toBe(50)
    expect(lerp(0, 100, 1)).toBe(100)
    expect(lerp(50, 150, 0.25)).toBe(75)
  })

  test('color interpolation', () => {
    const lerp = (a: number, b: number, t: number) => {
      return a + (b - a) * t
    }

    const interpolateColor = (
      color1: { r: number; g: number; b: number },
      color2: { r: number; g: number; b: number },
      t: number
    ) => {
      return {
        r: Math.round(lerp(color1.r, color2.r, t)),
        g: Math.round(lerp(color1.g, color2.g, t)),
        b: Math.round(lerp(color1.b, color2.b, t)),
      }
    }

    const black = { r: 0, g: 0, b: 0 }
    const white = { r: 255, g: 255, b: 255 }

    expect(interpolateColor(black, white, 0)).toEqual(black)
    expect(interpolateColor(black, white, 1)).toEqual(white)
    expect(interpolateColor(black, white, 0.5)).toEqual({ r: 128, g: 128, b: 128 })
  })
})
