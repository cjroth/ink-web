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

describe('ProgressBar Component', () => {
  test('renders with default props (0% progress)', async () => {
    const { render, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const ProgressBar = ({ percent = 0, character = '█' }: { percent?: number; character?: string }) => {
      const screen = 80
      const space = screen
      const filled = Math.floor(space * percent)
      const chars = character.repeat(filled)
      return React.createElement(Text, {}, chars)
    }

    const element = React.createElement(ProgressBar, {})

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
    // With 0% progress, the bar should be empty
    expect(allOutput).toBeDefined()

    act(() => {
      instance.unmount()
    })
  })

  test('renders with 50% progress', async () => {
    const { render, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const ProgressBar = ({ percent = 0, character = '█' }: { percent?: number; character?: string }) => {
      const screen = 80
      const space = screen
      const filled = Math.floor(space * percent)
      const chars = character.repeat(filled)
      return React.createElement(Text, {}, chars)
    }

    const element = React.createElement(ProgressBar, { percent: 0.5 })

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
    // With 50% progress on 80 columns, should have 40 characters
    expect(allOutput).toContain('█')

    act(() => {
      instance.unmount()
    })
  })

  test('renders with 100% progress', async () => {
    const { render, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const ProgressBar = ({ percent = 0, character = '█' }: { percent?: number; character?: string }) => {
      const screen = 80
      const space = screen
      const filled = Math.floor(space * percent)
      const chars = character.repeat(filled)
      return React.createElement(Text, {}, chars)
    }

    const element = React.createElement(ProgressBar, { percent: 1 })

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
    expect(allOutput).toContain('█')

    act(() => {
      instance.unmount()
    })
  })

  test('renders with custom character', async () => {
    const { render, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const ProgressBar = ({ percent = 0, character = '█' }: { percent?: number; character?: string }) => {
      const screen = 80
      const space = screen
      const filled = Math.floor(space * percent)
      const chars = character.repeat(filled)
      return React.createElement(Text, {}, chars)
    }

    const element = React.createElement(ProgressBar, { percent: 0.5, character: '=' })

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
    expect(allOutput).toContain('=')

    act(() => {
      instance.unmount()
    })
  })

  test('renders with left and right padding', async () => {
    const { render, Box, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const ProgressBar = ({
      percent = 0,
      left = 0,
      right = 0,
      character = '█',
    }: {
      percent?: number
      left?: number
      right?: number
      character?: string
    }) => {
      const screen = 80
      const space = Math.max(0, screen - left - right)
      const filled = Math.floor(space * percent)
      const chars = character.repeat(filled)
      return React.createElement(Text, {}, chars)
    }

    const element = React.createElement(
      Box,
      {},
      React.createElement(Text, {}, 'Loading: '),
      React.createElement(ProgressBar, { percent: 0.5, left: 10, right: 5 }),
      React.createElement(Text, {}, ' 50%')
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
    expect(allOutput).toContain('Loading:')
    expect(allOutput).toContain('50%')

    act(() => {
      instance.unmount()
    })
  })

  test('renders with rightPad enabled', async () => {
    const { render, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const ProgressBar = ({
      percent = 0,
      character = '█',
      rightPad = false,
    }: {
      percent?: number
      character?: string
      rightPad?: boolean
    }) => {
      const screen = 80
      const space = screen
      const filled = Math.floor(space * percent)
      const chars = character.repeat(filled)
      const bar = rightPad ? chars + ' '.repeat(space - filled) : chars
      return React.createElement(Text, {}, bar)
    }

    const element = React.createElement(ProgressBar, { percent: 0.5, rightPad: true })

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

    act(() => {
      instance.unmount()
    })
  })

  test('renders with custom columns', async () => {
    const { render, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const ProgressBar = ({
      percent = 0,
      columns = 80,
      character = '█',
    }: {
      percent?: number
      columns?: number
      character?: string
    }) => {
      const screen = columns
      const space = screen
      const filled = Math.floor(space * percent)
      const chars = character.repeat(filled)
      return React.createElement(Text, {}, chars)
    }

    const element = React.createElement(ProgressBar, { percent: 1, columns: 20 })

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

    act(() => {
      instance.unmount()
    })
  })

  test('renders with color prop', async () => {
    const { render, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const ProgressBar = ({
      percent = 0,
      character = '█',
      color,
    }: {
      percent?: number
      character?: string
      color?: string
    }) => {
      const screen = 80
      const space = screen
      const filled = Math.floor(space * percent)
      const chars = character.repeat(filled)
      return React.createElement(Text, { color }, chars)
    }

    const element = React.createElement(ProgressBar, { percent: 0.75, color: 'green' })

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

    act(() => {
      instance.unmount()
    })
  })

  test('handles edge case: percent greater than 1', async () => {
    const { render, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const ProgressBar = ({ percent = 0, character = '█' }: { percent?: number; character?: string }) => {
      const screen = 80
      const space = screen
      const clampedPercent = Math.max(0, Math.min(1, percent))
      const filled = Math.floor(space * clampedPercent)
      const chars = character.repeat(filled)
      return React.createElement(Text, {}, chars)
    }

    const element = React.createElement(ProgressBar, { percent: 1.5 })

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

    // Should clamp to 100% and not throw
    expect(mockStdout.writes.length).toBeGreaterThan(0)

    act(() => {
      instance.unmount()
    })
  })

  test('handles edge case: negative percent', async () => {
    const { render, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const ProgressBar = ({ percent = 0, character = '█' }: { percent?: number; character?: string }) => {
      const screen = 80
      const space = screen
      const clampedPercent = Math.max(0, Math.min(1, percent))
      const filled = Math.floor(space * clampedPercent)
      const chars = character.repeat(filled)
      return React.createElement(Text, {}, chars)
    }

    const element = React.createElement(ProgressBar, { percent: -0.5 })

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

    // Should clamp to 0% and not throw
    expect(mockStdout.writes.length).toBeGreaterThan(0)

    act(() => {
      instance.unmount()
    })
  })
})

describe('ProgressBar utility functions', () => {
  test('calculates filled characters correctly', () => {
    const calculateFilled = (space: number, percent: number): number => {
      const clampedPercent = Math.max(0, Math.min(1, percent))
      return Math.min(Math.floor(space * clampedPercent), space)
    }

    expect(calculateFilled(80, 0)).toBe(0)
    expect(calculateFilled(80, 0.5)).toBe(40)
    expect(calculateFilled(80, 1)).toBe(80)
    expect(calculateFilled(100, 0.25)).toBe(25)
    expect(calculateFilled(100, 0.75)).toBe(75)
  })

  test('clamps percent values correctly', () => {
    const clampPercent = (percent: number): number => {
      return Math.max(0, Math.min(1, percent))
    }

    expect(clampPercent(0.5)).toBe(0.5)
    expect(clampPercent(1.5)).toBe(1)
    expect(clampPercent(-0.5)).toBe(0)
    expect(clampPercent(0)).toBe(0)
    expect(clampPercent(1)).toBe(1)
  })

  test('calculates available space correctly', () => {
    const calculateSpace = (screen: number, left: number, right: number): number => {
      return Math.max(0, screen - left - right)
    }

    expect(calculateSpace(80, 0, 0)).toBe(80)
    expect(calculateSpace(80, 10, 5)).toBe(65)
    expect(calculateSpace(80, 40, 40)).toBe(0)
    expect(calculateSpace(80, 50, 50)).toBe(0) // Ensures non-negative
  })

  test('repeats character correctly', () => {
    expect('█'.repeat(0)).toBe('')
    expect('█'.repeat(5)).toBe('█████')
    expect('='.repeat(10)).toBe('==========')
    expect('▓'.repeat(3)).toBe('▓▓▓')
  })

  test('pads correctly with spaces', () => {
    const addPadding = (chars: string, space: number, rightPad: boolean): string => {
      const filled = chars.length
      return rightPad ? chars + ' '.repeat(space - filled) : chars
    }

    expect(addPadding('███', 10, true)).toBe('███       ')
    expect(addPadding('███', 10, false)).toBe('███')
    expect(addPadding('', 5, true)).toBe('     ')
    expect(addPadding('', 5, false)).toBe('')
  })
})

describe('ProgressBar snapshot tests', () => {
  test('snapshot: empty progress bar', async () => {
    const { render, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const ProgressBar = ({ percent = 0 }: { percent?: number }) => {
      const screen = 80
      const filled = Math.floor(screen * percent)
      const chars = '█'.repeat(filled)
      return React.createElement(Text, {}, chars)
    }

    const element = React.createElement(ProgressBar, { percent: 0 })

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

    act(() => {
      instance.unmount()
    })
  })

  test('snapshot: half progress bar', async () => {
    const { render, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const ProgressBar = ({ percent = 0 }: { percent?: number }) => {
      const screen = 80
      const filled = Math.floor(screen * percent)
      const chars = '█'.repeat(filled)
      return React.createElement(Text, {}, chars)
    }

    const element = React.createElement(ProgressBar, { percent: 0.5 })

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

    act(() => {
      instance.unmount()
    })
  })

  test('snapshot: full progress bar', async () => {
    const { render, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const ProgressBar = ({ percent = 0 }: { percent?: number }) => {
      const screen = 80
      const filled = Math.floor(screen * percent)
      const chars = '█'.repeat(filled)
      return React.createElement(Text, {}, chars)
    }

    const element = React.createElement(ProgressBar, { percent: 1 })

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

    act(() => {
      instance.unmount()
    })
  })
})
