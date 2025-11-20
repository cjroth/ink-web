import { describe, expect, test } from 'bun:test'
import React from 'react'

/**
 * This test reproduces the Next.js environment issue where Yoga.Node.create
 * fails because the Yoga proxy doesn't properly handle nested object access.
 * 
 * The bundled version replaces top-level await with a Proxy-based approach,
 * and this test verifies that the proxy correctly forwards nested method calls
 * like Yoga.Node.create() and Yoga.Config.create().
 */

describe('Yoga Proxy in bundled environment', () => {
  test('Yoga.Node.create() should work through proxy without xterm', async () => {
    // Import the bundled version which uses the Yoga proxy
    const mod = await import('./bundled')
    
    // Wait for yoga to initialize
    if (mod.waitForYogaInit) {
      await mod.waitForYogaInit()
    }
    
    // Give it extra time to ensure fully initialized
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Try to render a simple component
    const { render, Text } = mod
    
    // Create a simple element
    const element = React.createElement(Text, {}, 'Test')
    
    // Create a mock stdout
    const writes: string[] = []
    const mockStdout = {
      writes,
      columns: 80,
      rows: 24,
      isTTY: true,
      write: (str: string) => {
        writes.push(str)
        return true
      },
      on: () => {},
      off: () => {},
      emit: () => {},
      setDefaultEncoding: () => mockStdout,
      cork: () => {},
      uncork: () => {},
    }
    
    // This should not throw "Yoga.Node.create is not a function"
    let instance: any
    let error: Error | null = null
    
    try {
      instance = render(element, {
        stdout: mockStdout as any,
        stderr: mockStdout as any,
        stdin: process.stdin as any,
        patchConsole: false,
        debug: true,
      })
      
      // Wait for render to complete
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (e) {
      error = e as Error
    }
    
    // Should not have an error
    if (error) {
      console.error('❌ Error during render:', error.message)
      console.error('Stack:', error.stack)
    }
    
    expect(error).toBeNull()
    expect(instance).toBeDefined()
    expect(writes.length).toBeGreaterThan(0)
    
    // Check that actual text was written
    const allOutput = writes.join('')
    expect(allOutput).toContain('Test')
    
    // Cleanup
    if (instance) {
      instance.unmount()
    }
  })
  
  test('can access Yoga constants through proxy directly', async () => {
    // Import bundled to ensure yoga is initialized
    const mod = await import('./bundled')
    if (mod.waitForYogaInit) {
      await mod.waitForYogaInit()
    }

    // Wait for yoga to initialize
    await new Promise(resolve => setTimeout(resolve, 300))

    // Check if we can access the yoga instance through global
    // Note: __yogaPromise is set by post-build script, may not exist in test env
    const yogaPromise = (globalThis as any).__yogaPromise

    if (!yogaPromise) {
      // Skip test if __yogaPromise not available (source-level testing)
      console.log('⚠️ __yogaPromise not available (post-build feature), skipping direct yoga access test')
      return
    }

    const yoga = await yogaPromise
    expect(yoga).toBeDefined()
    expect(yoga.Node).toBeDefined()

    console.log('✅ Yoga.Node type:', typeof yoga.Node)
    console.log('✅ Yoga.Node.create type:', typeof yoga.Node.create)

    expect(typeof yoga.Node.create).toBe('function')

    // Try to actually create a node - this is where Next.js fails
    try {
      const node = yoga.Node.create()
      expect(node).toBeDefined()
      console.log('✅ Successfully created yoga node')
    } catch (e) {
      console.error('❌ Failed to create node:', (e as Error).message)
      throw e
    }
  })
  
  test('nested proxy caching works correctly', async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const yogaPromise = (globalThis as any).__yogaPromise
    if (yogaPromise) {
      const yoga = await yogaPromise
      
      // Access Node multiple times - should return the same cached proxy
      const node1 = yoga.Node
      const node2 = yoga.Node
      
      console.log('✅ node1 === node2:', node1 === node2)
      
      // These should be the same object due to caching
      expect(node1).toBe(node2)
      
      // And both should have working create methods
      expect(typeof node1.create).toBe('function')
      expect(typeof node2.create).toBe('function')
      
      const instance1 = node1.create()
      const instance2 = node2.create()
      
      expect(instance1).toBeDefined()
      expect(instance2).toBeDefined()
      
      console.log('✅ Both instances created successfully')
    }
  })
})

