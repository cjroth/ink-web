import { describe, expect, test, afterEach } from 'bun:test'
import React, { useState } from 'react'
import { Text, Box, useInput } from 'ink'
import { renderTui, cleanup } from '../src/index.ts'

afterEach(() => {
  cleanup()
})

// Simple test component
function Counter() {
  const [count, setCount] = useState(0)

  useInput((input, key) => {
    if (key.return) setCount(c => c + 1)
    if (input === 'r') setCount(0)
    if (key.downArrow) setCount(c => c - 1)
  })

  return (
    <Box flexDirection="column">
      <Text>Count: {count}</Text>
      {count >= 3 && <Text color="green">You reached 3!</Text>}
    </Box>
  )
}

// Multi-step component
function Steps() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')

  useInput((input, key) => {
    if (step === 1 && key.return) {
      setStep(2)
    } else if (step === 2) {
      if (key.return && name) {
        setStep(3)
      } else if (key.backspace) {
        setName(n => n.slice(0, -1))
      } else if (input && !key.ctrl && !key.meta) {
        setName(n => n + input)
      }
    }
  })

  if (step === 1) return <Text>Step 1: Press Enter to continue</Text>
  if (step === 2) return (
    <Box flexDirection="column">
      <Text>Step 2: Type your name</Text>
      <Text>Name: {name || '(empty)'}</Text>
    </Box>
  )
  return <Text>Step 3: Hello, {name}!</Text>
}

describe('renderTui', () => {
  test('renders a component and reads screen text', () => {
    const tui = renderTui(<Counter />)
    expect(tui.screen.text()).toContain('Count: 0')
    tui.unmount()
  })

  test('screen.contains works', () => {
    const tui = renderTui(<Counter />)
    expect(tui.screen.contains('Count: 0')).toBe(true)
    expect(tui.screen.contains('nope')).toBe(false)
    tui.unmount()
  })

  test('screen.matches works with regex', () => {
    const tui = renderTui(<Counter />)
    expect(tui.screen.matches(/Count: \d+/)).toBe(true)
    tui.unmount()
  })

  test('screen.lines returns non-empty lines', () => {
    const tui = renderTui(<Counter />)
    const lines = tui.screen.lines()
    expect(lines.length).toBeGreaterThanOrEqual(1)
    expect(lines[0]).toContain('Count: 0')
    tui.unmount()
  })
})

describe('keys', () => {
  test('enter increments counter', async () => {
    const tui = renderTui(<Counter />)
    expect(tui.screen.contains('Count: 0')).toBe(true)

    tui.keys.enter()
    await tui.flush()
    expect(tui.screen.contains('Count: 1')).toBe(true)

    tui.keys.enter()
    await tui.flush()
    expect(tui.screen.contains('Count: 2')).toBe(true)
    tui.unmount()
  })

  test('press sends a character key', async () => {
    const tui = renderTui(<Counter />)
    tui.keys.enter()
    tui.keys.enter()
    await tui.flush()
    expect(tui.screen.contains('Count: 2')).toBe(true)

    tui.keys.press('r')
    await tui.flush()
    expect(tui.screen.contains('Count: 0')).toBe(true)
    tui.unmount()
  })

  test('arrow keys work', async () => {
    const tui = renderTui(<Counter />)
    tui.keys.down()
    await tui.flush()
    expect(tui.screen.contains('Count: -1')).toBe(true)
    tui.unmount()
  })

  test('type sends multiple characters', async () => {
    const tui = renderTui(<Steps />)
    tui.keys.enter()
    await tui.flush()
    tui.keys.type('Alice')
    await tui.flush()
    expect(tui.screen.contains('Name: Alice')).toBe(true)
    tui.unmount()
  })
})

describe('waitFor', () => {
  test('resolves immediately when text is already present', async () => {
    const tui = renderTui(<Counter />)
    await tui.waitFor('Count: 0')
    tui.unmount()
  })

  test('resolves when text appears after key press', async () => {
    const tui = renderTui(<Counter />)
    tui.keys.enter()
    tui.keys.enter()
    tui.keys.enter()
    await tui.waitFor('You reached 3!')
    tui.unmount()
  })

  test('times out with useful error message', async () => {
    const tui = renderTui(<Counter />)
    try {
      await tui.waitFor('this will never appear', { timeout: 200 })
      throw new Error('should have thrown')
    } catch (e: any) {
      expect(e.message).toContain('this will never appear')
      expect(e.message).toContain('Count: 0')
    }
    tui.unmount()
  })

  test('waitFor with assertion function', async () => {
    const tui = renderTui(<Counter />)
    tui.keys.enter()
    await tui.waitFor(() => {
      expect(tui.screen.text()).toContain('Count: 1')
    })
    tui.unmount()
  })
})

describe('multi-step navigation', () => {
  test('navigates through all steps', async () => {
    const tui = renderTui(<Steps />)

    await tui.waitFor('Step 1')
    tui.keys.enter()

    await tui.waitFor('Step 2')
    tui.keys.type('Bob')
    await tui.waitFor('Name: Bob')

    tui.keys.enter()
    await tui.waitFor('Hello, Bob!')
    tui.unmount()
  })
})
