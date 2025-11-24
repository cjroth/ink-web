import { describe, expect, test, beforeAll, afterEach } from 'bun:test'
import React from 'react'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { act } from '@testing-library/react'

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

describe('Divider Component', () => {
  test('renders simple divider', async () => {
    const { render, Box } = await import('./bundled')
    const mockStdout = createMockStdout()

    const BaseDivider = ({ dividerChar, dividerColor = 'gray' }: { dividerChar?: string; dividerColor?: string }) => (
      <Box
        // @ts-expect-error
        borderStyle={{ bottom: dividerChar }}
        borderColor={dividerColor}
        flexGrow={1}
        borderBottom={true}
        borderTop={false}
        borderLeft={false}
        borderRight={false}
      />
    )

    const Divider = ({ padding = 0, dividerChar = '─', dividerColor = 'gray' }: any) => (
      <Box paddingLeft={padding} paddingRight={padding}>
        <BaseDivider dividerChar={dividerChar} dividerColor={dividerColor} />
      </Box>
    )

    const element = React.createElement(Divider, {})

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

  test('renders divider with title', async () => {
    const { render, Box, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const BaseDivider = ({ dividerChar, dividerColor = 'gray' }: { dividerChar?: string; dividerColor?: string }) => (
      <Box
        // @ts-expect-error
        borderStyle={{ bottom: dividerChar }}
        borderColor={dividerColor}
        flexGrow={1}
        borderBottom={true}
        borderTop={false}
        borderLeft={false}
        borderRight={false}
      />
    )

    const Divider = ({
      title,
      width = 'auto',
      padding = 0,
      titlePadding = 1,
      titleColor = 'white',
      dividerChar = '─',
      dividerColor = 'gray',
    }: any) => {
      const dividerLine = <BaseDivider dividerChar={dividerChar} dividerColor={dividerColor} />

      if (!title) {
        return (
          <Box paddingLeft={padding} paddingRight={padding}>
            {dividerLine}
          </Box>
        )
      }

      return (
        <Box width={width} paddingLeft={padding} paddingRight={padding} gap={titlePadding}>
          {dividerLine}
          <Box>
            <Text color={titleColor}>{title}</Text>
          </Box>
          {dividerLine}
        </Box>
      )
    }

    const element = React.createElement(Divider, { title: 'Section' })

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
    expect(allOutput).toContain('Section')

    act(() => {
      instance.unmount()
    })
  })

  test('renders divider with custom colors', async () => {
    const { render, Box, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const BaseDivider = ({ dividerChar, dividerColor = 'gray' }: { dividerChar?: string; dividerColor?: string }) => (
      <Box
        // @ts-expect-error
        borderStyle={{ bottom: dividerChar }}
        borderColor={dividerColor}
        flexGrow={1}
        borderBottom={true}
        borderTop={false}
        borderLeft={false}
        borderRight={false}
      />
    )

    const Divider = ({
      title,
      width = 'auto',
      padding = 0,
      titlePadding = 1,
      titleColor = 'white',
      dividerChar = '─',
      dividerColor = 'gray',
    }: any) => {
      const dividerLine = <BaseDivider dividerChar={dividerChar} dividerColor={dividerColor} />

      if (!title) {
        return (
          <Box paddingLeft={padding} paddingRight={padding}>
            {dividerLine}
          </Box>
        )
      }

      return (
        <Box width={width} paddingLeft={padding} paddingRight={padding} gap={titlePadding}>
          {dividerLine}
          <Box>
            <Text color={titleColor}>{title}</Text>
          </Box>
          {dividerLine}
        </Box>
      )
    }

    const element = React.createElement(Divider, {
      title: 'Options',
      titleColor: 'cyan',
      dividerColor: 'blue',
    })

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
    expect(allOutput).toContain('Options')

    act(() => {
      instance.unmount()
    })
  })
})

describe('Divider Component Snapshots', () => {
  test('simple divider snapshot', async () => {
    const { render, Box } = await import('./bundled')
    const mockStdout = createMockStdout()

    const BaseDivider = ({ dividerChar, dividerColor = 'gray' }: { dividerChar?: string; dividerColor?: string }) => (
      <Box
        // @ts-expect-error
        borderStyle={{ bottom: dividerChar }}
        borderColor={dividerColor}
        flexGrow={1}
        borderBottom={true}
        borderTop={false}
        borderLeft={false}
        borderRight={false}
      />
    )

    const Divider = ({ padding = 0, dividerChar = '─', dividerColor = 'gray' }: any) => (
      <Box paddingLeft={padding} paddingRight={padding}>
        <BaseDivider dividerChar={dividerChar} dividerColor={dividerColor} />
      </Box>
    )

    const element = React.createElement(Divider, {})

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

  test('divider with title snapshot', async () => {
    const { render, Box, Text } = await import('./bundled')
    const mockStdout = createMockStdout()

    const BaseDivider = ({ dividerChar, dividerColor = 'gray' }: { dividerChar?: string; dividerColor?: string }) => (
      <Box
        // @ts-expect-error
        borderStyle={{ bottom: dividerChar }}
        borderColor={dividerColor}
        flexGrow={1}
        borderBottom={true}
        borderTop={false}
        borderLeft={false}
        borderRight={false}
      />
    )

    const Divider = ({
      title,
      width = 'auto',
      padding = 0,
      titlePadding = 1,
      titleColor = 'white',
      dividerChar = '─',
      dividerColor = 'gray',
    }: any) => {
      const dividerLine = <BaseDivider dividerChar={dividerChar} dividerColor={dividerColor} />

      return (
        <Box width={width} paddingLeft={padding} paddingRight={padding} gap={titlePadding}>
          {dividerLine}
          <Box>
            <Text color={titleColor}>{title}</Text>
          </Box>
          {dividerLine}
        </Box>
      )
    }

    const element = React.createElement(Divider, { title: 'Test Section' })

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
