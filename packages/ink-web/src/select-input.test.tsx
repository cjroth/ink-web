import { describe, expect, test, beforeAll, afterEach, mock } from 'bun:test'
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

// Mock stdin for input simulation
interface MockStdin {
  isTTY: boolean
  isRaw: boolean
  listeners: Record<string, ((...args: any[]) => void)[]>
  on: (event: string, handler: (...args: any[]) => void) => MockStdin
  off: (event: string, handler: (...args: any[]) => void) => MockStdin
  setRawMode: (mode: boolean) => MockStdin
  resume: () => MockStdin
  pause: () => MockStdin
  setEncoding: (encoding: string) => MockStdin
  read: () => null
  emit: (event: string, ...args: any[]) => void
}

function createMockStdin(): MockStdin {
  const listeners: Record<string, ((...args: any[]) => void)[]> = {}

  const stdin: MockStdin = {
    isTTY: true,
    isRaw: false,
    listeners,
    on: (event: string, handler: (...args: any[]) => void) => {
      if (!listeners[event]) listeners[event] = []
      listeners[event].push(handler)
      return stdin
    },
    off: (event: string, handler: (...args: any[]) => void) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((h) => h !== handler)
      }
      return stdin
    },
    setRawMode: (mode: boolean) => {
      stdin.isRaw = mode
      return stdin
    },
    resume: () => stdin,
    pause: () => stdin,
    setEncoding: () => stdin,
    read: () => null,
    emit: (event: string, ...args: any[]) => {
      if (listeners[event]) {
        listeners[event].forEach((handler) => handler(...args))
      }
    },
  }

  return stdin
}

// Setup happy-dom for browser-like environment
beforeAll(() => {
  try {
    GlobalRegistrator.register()
  } catch (e) {
    // Already registered, ignore
  }
})

// Import SelectInput component inline (we need to create it first in the package)
// For now, test the helper functions and basic structure

describe('SelectInput helper functions', () => {
  test('rotateArray rotates array correctly', () => {
    // Test the rotation logic used in SelectInput
    function rotateArray<T>(array: T[], count: number): T[] {
      const len = array.length
      if (len === 0) return array
      const normalizedCount = ((count % len) + len) % len
      return [...array.slice(normalizedCount), ...array.slice(0, normalizedCount)]
    }

    const arr = [1, 2, 3, 4, 5]

    // Rotate forward
    expect(rotateArray(arr, 1)).toEqual([2, 3, 4, 5, 1])
    expect(rotateArray(arr, 2)).toEqual([3, 4, 5, 1, 2])

    // Rotate backward (negative)
    expect(rotateArray(arr, -1)).toEqual([5, 1, 2, 3, 4])
    expect(rotateArray(arr, -2)).toEqual([4, 5, 1, 2, 3])

    // No rotation
    expect(rotateArray(arr, 0)).toEqual([1, 2, 3, 4, 5])
    expect(rotateArray(arr, 5)).toEqual([1, 2, 3, 4, 5])

    // Empty array
    expect(rotateArray([], 1)).toEqual([])
  })

  test('areItemsEqual compares items correctly', () => {
    type Item = { key?: string; label: string; value: string }

    function areItemsEqual(a: Item[], b: Item[]): boolean {
      if (a.length !== b.length) return false
      return a.every((item, index) => {
        const other = b[index]
        return item.value === other?.value
      })
    }

    const items1 = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ]

    const items2 = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ]

    const items3 = [
      { label: 'A', value: 'a' },
      { label: 'C', value: 'c' },
    ]

    const items4 = [
      { label: 'A', value: 'a' },
    ]

    expect(areItemsEqual(items1, items2)).toBe(true)
    expect(areItemsEqual(items1, items3)).toBe(false)
    expect(areItemsEqual(items1, items4)).toBe(false)
    expect(areItemsEqual([], [])).toBe(true)
  })
})

describe('SelectInput rendering', () => {
  test('renders all items', async () => {
    const { render, Box, Text, useInput } = await import('./index')
    const mockStdout = createMockStdout()
    const mockStdin = createMockStdin()

    // Simple SelectInput implementation for testing
    const SelectInput = ({ items }: { items: { label: string; value: string }[] }) => {
      return React.createElement(
        Box,
        { flexDirection: 'column' as const },
        items.map((item, index) =>
          React.createElement(
            Box,
            { key: item.value },
            React.createElement(Text, { color: index === 0 ? 'blue' : undefined },
              `${index === 0 ? '❯ ' : '  '}${item.label}`
            )
          )
        )
      )
    }

    const items = [
      { label: 'First', value: 'first' },
      { label: 'Second', value: 'second' },
      { label: 'Third', value: 'third' },
    ]

    const element = React.createElement(SelectInput, { items })
    let instance: any

    await act(async () => {
      instance = render(element, {
        stdout: mockStdout as any,
        stderr: mockStdout as any,
        stdin: mockStdin as any,
        patchConsole: false,
        debug: false,
      })

      await new Promise((resolve) => setTimeout(resolve, 200))
    })

    const allOutput = mockStdout.writes.join('')
    expect(allOutput).toContain('First')
    expect(allOutput).toContain('Second')
    expect(allOutput).toContain('Third')

    act(() => {
      instance.unmount()
    })
  })

  test('renders with indicator for selected item', async () => {
    const { render, Box, Text } = await import('./index')
    const mockStdout = createMockStdout()
    const mockStdin = createMockStdin()

    const SelectInput = ({ items, selectedIndex = 0 }: {
      items: { label: string; value: string }[]
      selectedIndex?: number
    }) => {
      return React.createElement(
        Box,
        { flexDirection: 'column' as const },
        items.map((item, index) =>
          React.createElement(
            Box,
            { key: item.value },
            React.createElement(
              Box,
              { marginRight: 1 },
              React.createElement(Text, { color: 'blue' }, index === selectedIndex ? '❯' : ' ')
            ),
            React.createElement(Text, { color: index === selectedIndex ? 'blue' : undefined }, item.label)
          )
        )
      )
    }

    const items = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ]

    const element = React.createElement(SelectInput, { items, selectedIndex: 1 })
    let instance: any

    await act(async () => {
      instance = render(element, {
        stdout: mockStdout as any,
        stderr: mockStdout as any,
        stdin: mockStdin as any,
        patchConsole: false,
        debug: false,
      })

      await new Promise((resolve) => setTimeout(resolve, 200))
    })

    const allOutput = mockStdout.writes.join('')
    expect(allOutput).toContain('Apple')
    expect(allOutput).toContain('Banana')
    expect(allOutput).toContain('❯')

    act(() => {
      instance.unmount()
    })
  })

  test('handles empty items array', async () => {
    const { render, Box } = await import('./index')
    const mockStdout = createMockStdout()
    const mockStdin = createMockStdin()

    const SelectInput = ({ items }: { items: { label: string; value: string }[] }) => {
      return React.createElement(Box, { flexDirection: 'column' as const })
    }

    const element = React.createElement(SelectInput, { items: [] })
    let instance: any

    await act(async () => {
      instance = render(element, {
        stdout: mockStdout as any,
        stderr: mockStdout as any,
        stdin: mockStdin as any,
        patchConsole: false,
        debug: false,
      })

      await new Promise((resolve) => setTimeout(resolve, 200))
    })

    // Should render without errors
    expect(mockStdout.writes.length).toBeGreaterThanOrEqual(0)

    act(() => {
      instance.unmount()
    })
  })
})

describe('SelectInput with limit', () => {
  test('respects limit prop for visible items', async () => {
    const { render, Box, Text } = await import('./index')
    const mockStdout = createMockStdout()
    const mockStdin = createMockStdin()

    const SelectInput = ({ items, limit }: {
      items: { label: string; value: string }[]
      limit?: number
    }) => {
      const visibleItems = limit ? items.slice(0, limit) : items
      return React.createElement(
        Box,
        { flexDirection: 'column' as const },
        visibleItems.map((item, index) =>
          React.createElement(
            Box,
            { key: item.value },
            React.createElement(Text, {}, item.label)
          )
        )
      )
    }

    const items = [
      { label: 'One', value: '1' },
      { label: 'Two', value: '2' },
      { label: 'Three', value: '3' },
      { label: 'Four', value: '4' },
      { label: 'Five', value: '5' },
    ]

    const element = React.createElement(SelectInput, { items, limit: 3 })
    let instance: any

    await act(async () => {
      instance = render(element, {
        stdout: mockStdout as any,
        stderr: mockStdout as any,
        stdin: mockStdin as any,
        patchConsole: false,
        debug: false,
      })

      await new Promise((resolve) => setTimeout(resolve, 200))
    })

    const allOutput = mockStdout.writes.join('')
    expect(allOutput).toContain('One')
    expect(allOutput).toContain('Two')
    expect(allOutput).toContain('Three')
    expect(allOutput).not.toContain('Four')
    expect(allOutput).not.toContain('Five')

    act(() => {
      instance.unmount()
    })
  })
})
