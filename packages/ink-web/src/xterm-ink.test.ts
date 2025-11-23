import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { Box, Text } from 'ink'

// Minimal DOM setup for testing
beforeAll(() => {
  // @ts-ignore
  global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
  }
  // @ts-ignore
  global.ResizeObserver = class {
    observe() {}
    disconnect() {}
  }
})

describe('Bundled imports', () => {
  test('can import from bundled', async () => {
    const mod = await import('./bundled')
    expect(mod.Box).toBeDefined()
    expect(mod.Text).toBeDefined()
    expect(mod.InkTerminalBox).toBeDefined()
    expect(mod.mountInkInXterm).toBeDefined()
  })

  test('Ink components are properly imported', async () => {
    const { Box: BoxImport, Text: TextImport } = await import('./bundled')
    // Verify they're actually React components
    const boxElement = React.createElement(BoxImport, {}, 'test')
    const textElement = React.createElement(TextImport, {}, 'test')
    expect(boxElement).toBeDefined()
    expect(textElement).toBeDefined()
  })
})

describe('Stream shims', () => {
  test('Writable stream works', async () => {
    const { Writable } = await import('./shims/stream')
    const stream = new Writable()
    const writes: string[] = []
    
    stream.on('data', (data) => {
      writes.push(String(data))
    })
    
    stream.write('Hello')
    stream.write(' World')
    
    expect(writes).toEqual(['Hello', ' World'])
  })

  test('Readable stream works', async () => {
    const { Readable } = await import('./shims/stream')
    const stream = new Readable()
    expect(stream.readable).toBe(true)
  })
})

describe('Ink rendering', () => {
  test('Ink renders to custom stream', async () => {
    const { render } = await import('ink')
    const { Writable } = await import('./shims/stream')
    
    const stdout = new Writable()
    const writes: string[] = []
    
    // Mock stdout properties that Ink needs
    Object.assign(stdout, {
      columns: 80,
      rows: 24,
      isTTY: true,
      write: (str: string) => {
        writes.push(str)
        return true
      },
    })
    
    const element = React.createElement(Text, {}, 'Hello Ink!')
    const instance = render(element, { 
      stdout: stdout as any,
      stderr: stdout as any,
      stdin: process.stdin as any,
      patchConsole: false,
      debug: false,
    })
    
    // Wait a bit for Ink to render
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log('Writes received:', writes)
    expect(writes.length).toBeGreaterThan(0)
    
    instance.unmount()
  })

  test('Ink Box and Text render correctly', async () => {
    const { render } = await import('ink')
    const { Box, Text } = await import('./bundled')
    const { Writable } = await import('./shims/stream')
    
    const stdout = new Writable()
    const writes: string[] = []
    
    Object.assign(stdout, {
      columns: 80,
      rows: 24,
      isTTY: true,
      write: (str: string) => {
        writes.push(str)
        console.log('Received write:', str.substring(0, 50))
        return true
      },
    })
    
    const element = React.createElement(
      Box,
      { flexDirection: 'column' },
      React.createElement(Text, { color: 'green' }, 'Test Message')
    )
    
    const instance = render(element, {
      stdout: stdout as any,
      stderr: stdout as any,
      stdin: process.stdin as any,
      patchConsole: false,
      debug: false,
    })
    
    // Wait for Ink to render
    await new Promise(resolve => setTimeout(resolve, 200))
    
    console.log('Total writes:', writes.length)
    console.log('First write:', writes[0]?.substring(0, 100))
    
    expect(writes.length).toBeGreaterThan(0)
    
    instance.unmount()
  })
})
