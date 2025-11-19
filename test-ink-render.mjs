// Simple test to check if Ink from semi-bundled actually renders
import React from 'react'

// Mock minimal stream
class TestStream {
  constructor() {
    this.writes = []
    this.columns = 80
    this.rows = 24
    this.isTTY = true
  }
  
  write(str) {
    console.log('WRITE CALLED:', str.substring(0, 50))
    this.writes.push(str)
    return true
  }
  
  setDefaultEncoding() {
    return this
  }
  
  cork() {}
  uncork() {}
  on() {}
  emit() {}
}

async function testInk() {
  try {
    console.log('Loading semi-bundled...')
    const { render, Text } = await import('./dist/semi-bundled.js')
    console.log('Loaded successfully')
    
    const stdout = new TestStream()
    const element = React.createElement(Text, {}, 'Hello Test!')
    
    console.log('Rendering...')
    const instance = render(element, {
      stdout,
      stderr: stdout,
      stdin: process.stdin,
      patchConsole: false,
      debug: false,
    })
    
    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 300))
    
    console.log('Writes received:', stdout.writes.length)
    console.log('First write:', stdout.writes[0])
    
    instance.unmount()
    process.exit(0)
  } catch (e) {
    console.error('Error:', e.message)
    console.error(e.stack)
    process.exit(1)
  }
}

testInk()

