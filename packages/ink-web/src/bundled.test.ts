import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { GlobalRegistrator } from '@happy-dom/global-registrator'

// Setup happy-dom for browser-like environment
beforeAll(() => {
  try {
    GlobalRegistrator.register()
  } catch (e) {
    // Already registered, ignore
  }
})

describe('Bundled without browser', () => {
  test('Can import Ink components from bundled', async () => {
    // This should work with happy-dom providing document/window
    const { Box, Text, render } = await import('./bundled')
    expect(Box).toBeDefined()
    expect(Text).toBeDefined()
    expect(render).toBeDefined()
  })

  test('Ink from bundled renders to stream', async () => {
    const { Box, Text, render } = await import('./bundled')
    const { Writable } = await import('./shims/stream')
    
    const stdout = new Writable()
    const writes: string[] = []
    const listeners: Record<string, ((...args: any[]) => void)[]> = {}
    
    Object.assign(stdout, {
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
      setDefaultEncoding: () => stdout,
      cork: () => {},
      uncork: () => {},
    })
    
    try {
      // Wait for yoga to be ready
      if ((globalThis as any).__yogaPromise) {
        await (globalThis as any).__yogaPromise
        console.log('Yoga promise resolved')
      }
      
      const element = React.createElement(Text, {}, 'Hello Bundled!')
      const instance = render(element, {
        stdout: stdout as any,
        stderr: stdout as any,
        stdin: process.stdin as any,
        patchConsole: false,
        debug: false,
      })
      
      // Wait for Ink to render
      await new Promise(resolve => setTimeout(resolve, 200))
      
      console.log('Bundled writes:', writes)
      console.log('First write:', writes[0])
      
      expect(writes.length).toBeGreaterThan(0)
      
      instance.unmount()
    } catch (error) {
      console.error('Error during test:', error)
      throw error
    }
  })
})

