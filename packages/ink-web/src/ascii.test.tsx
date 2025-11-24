import { describe, expect, test, beforeAll, afterEach } from 'bun:test'
import React from 'react'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { act } from '@testing-library/react'
import figlet from 'figlet'

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

beforeAll(() => {
  try {
    GlobalRegistrator.register()
  } catch (e) {
    // Already registered
  }
})

afterEach(() => {})

describe('Ascii Component', () => {
  test('renders ASCII art text', async () => {
    const { render, Box, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const Ascii = ({ text, font = 'Standard', color }: { text: string; font?: string; color?: string }) => {
      const asciiArt = figlet.textSync(text, { font: font as any })
      return (
        <Box>
          <Text color={color}>{asciiArt}</Text>
        </Box>
      )
    }

    const element = React.createElement(Ascii, { text: 'Hi' })

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

  test('renders with custom font', async () => {
    const { render, Box, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const Ascii = ({ text, font = 'Standard', color }: { text: string; font?: string; color?: string }) => {
      const asciiArt = figlet.textSync(text, { font: font as any })
      return (
        <Box>
          <Text color={color}>{asciiArt}</Text>
        </Box>
      )
    }

    const element = React.createElement(Ascii, { text: 'Test', font: 'Big' })

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

  test('renders with color', async () => {
    const { render, Box, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const Ascii = ({ text, font = 'Standard', color }: { text: string; font?: string; color?: string }) => {
      const asciiArt = figlet.textSync(text, { font: font as any })
      return (
        <Box>
          <Text color={color}>{asciiArt}</Text>
        </Box>
      )
    }

    const element = React.createElement(Ascii, { text: 'Color', color: 'cyan' })

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

describe('Ascii Component Snapshots', () => {
  test('basic ascii snapshot', async () => {
    const { render, Box, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const Ascii = ({ text, font = 'Standard', color }: { text: string; font?: string; color?: string }) => {
      const asciiArt = figlet.textSync(text, { font: font as any })
      return (
        <Box>
          <Text color={color}>{asciiArt}</Text>
        </Box>
      )
    }

    const element = React.createElement(Ascii, { text: 'Hi' })

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

    const allOutput = mockStdout.writes.join('')
    expect(allOutput).toMatchSnapshot()

    act(() => {
      instance.unmount()
    })
  })
})

describe('figlet library', () => {
  test('figlet is available', () => {
    expect(figlet).toBeDefined()
    expect(figlet.textSync).toBeDefined()
  })

  test('figlet generates ASCII art', () => {
    const result = figlet.textSync('A', { font: 'Standard' })
    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
  })
})
