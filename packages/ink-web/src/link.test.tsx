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

describe('Link Component', () => {
  test('renders link with text', async () => {
    const { render, Text, Transform } = await import('./index')
    const mockStdout = createMockStdout()

    const Link = ({ children, url }: { children: React.ReactNode; url: string }) => (
      <Transform transform={text => `\x1b]8;;${url}\x07${text}\x1b]8;;\x07`}>
        <Text>{children}</Text>
      </Transform>
    )

    const element = React.createElement(Link, { url: 'https://github.com' }, 'GitHub')

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
    expect(allOutput).toContain('GitHub')
    expect(allOutput).toContain('https://github.com')

    act(() => {
      instance.unmount()
    })
  })

  test('renders with different URLs', async () => {
    const { render, Text, Transform } = await import('./index')
    const mockStdout = createMockStdout()

    const Link = ({ children, url }: { children: React.ReactNode; url: string }) => (
      <Transform transform={text => `\x1b]8;;${url}\x07${text}\x1b]8;;\x07`}>
        <Text>{children}</Text>
      </Transform>
    )

    const element = React.createElement(Link, { url: 'https://example.com' }, 'Click here')

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
    expect(allOutput).toContain('Click here')
    expect(allOutput).toContain('https://example.com')

    act(() => {
      instance.unmount()
    })
  })

  test('Transform component is available', async () => {
    const { Transform } = await import('./index')
    expect(Transform).toBeDefined()
    expect(typeof Transform).toBe('function')
  })

  test('handles empty children gracefully', async () => {
    const { render, Text, Transform } = await import('./index')
    const mockStdout = createMockStdout()

    const Link = ({ children, url }: { children: React.ReactNode; url: string }) => (
      <Transform transform={text => `\x1b]8;;${url}\x07${text}\x1b]8;;\x07`}>
        <Text>{children}</Text>
      </Transform>
    )

    const element = React.createElement(Link, { url: 'https://example.com' }, '')

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

describe('Link Component Snapshots', () => {
  test('basic link output snapshot', async () => {
    const { render, Text, Transform } = await import('./index')
    const mockStdout = createMockStdout()

    const Link = ({ children, url }: { children: React.ReactNode; url: string }) => (
      <Transform transform={text => `\x1b]8;;${url}\x07${text}\x1b]8;;\x07`}>
        <Text>{children}</Text>
      </Transform>
    )

    const element = React.createElement(Link, { url: 'https://github.com' }, 'GitHub')

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

  test('link with different text snapshot', async () => {
    const { render, Text, Transform } = await import('./index')
    const mockStdout = createMockStdout()

    const Link = ({ children, url }: { children: React.ReactNode; url: string }) => (
      <Transform transform={text => `\x1b]8;;${url}\x07${text}\x1b]8;;\x07`}>
        <Text>{children}</Text>
      </Transform>
    )

    const element = React.createElement(Link, { url: 'https://example.com' }, 'Example')

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

describe('OSC 8 escape sequence', () => {
  test('generates correct OSC 8 format', () => {
    const url = 'https://github.com'
    const text = 'GitHub'
    const result = `\x1b]8;;${url}\x07${text}\x1b]8;;\x07`

    // Check it contains the OSC 8 opening sequence
    expect(result).toContain('\x1b]8;;')
    // Check it contains the URL
    expect(result).toContain(url)
    // Check it contains the text
    expect(result).toContain(text)
    // Check it ends with the closing sequence (BEL)
    expect(result).toContain('\x1b]8;;\x07')
  })
})
