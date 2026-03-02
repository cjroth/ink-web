import { describe, expect, test, afterEach } from 'bun:test'
import React from 'react'
import { renderTui, cleanup } from 'ink-testing'
import { TextInput } from './text-input.tsx'

afterEach(() => {
  cleanup()
})

describe('TextInput', () => {
  test('renders with default prompt', () => {
    const tui = renderTui(<TextInput />)
    expect(tui.screen.contains('>')).toBe(true)
    tui.unmount()
  })

  test('renders placeholder when empty', () => {
    const tui = renderTui(<TextInput placeholder="Type here..." />)
    expect(tui.screen.contains('Type here...')).toBe(true)
    tui.unmount()
  })

  test('typing appends characters (uncontrolled mode)', async () => {
    const tui = renderTui(<TextInput />)

    tui.keys.press('h')
    await tui.flush()
    tui.keys.press('i')
    await tui.flush()

    expect(tui.screen.contains('hi')).toBe(true)
    tui.unmount()
  })

  test('backspace removes last character', async () => {
    const tui = renderTui(<TextInput />)

    tui.keys.press('a')
    await tui.flush()
    tui.keys.press('b')
    await tui.flush()
    expect(tui.screen.contains('ab')).toBe(true)

    tui.keys.backspace()
    await tui.flush()
    expect(tui.screen.contains('ab')).toBe(false)
    expect(tui.screen.contains('a')).toBe(true)
    tui.unmount()
  })

  test('Enter submits value and clears input', async () => {
    let submitted: string | undefined
    const tui = renderTui(
      <TextInput onSubmit={(val) => { submitted = val }} />
    )

    tui.keys.press('h')
    await tui.flush()
    tui.keys.press('i')
    await tui.flush()
    tui.keys.enter()
    await tui.flush()

    expect(submitted).toBe('hi')
    expect(tui.screen.contains('hi')).toBe(false)
    tui.unmount()
  })

  test('Enter does not submit empty value', async () => {
    let submitted: string | undefined
    const tui = renderTui(
      <TextInput onSubmit={(val) => { submitted = val }} />
    )

    tui.keys.enter()
    await tui.flush()
    expect(submitted).toBeUndefined()
    tui.unmount()
  })

  test('focus=false disables input', async () => {
    const changes: string[] = []
    const tui = renderTui(<TextInput focus={false} onChange={(v) => changes.push(v)} />)

    tui.keys.press('a')
    await tui.flush()
    expect(changes.length).toBe(0)
    tui.unmount()
  })

  test('onChange fires on each character', async () => {
    const changes: string[] = []
    const tui = renderTui(
      <TextInput onChange={(val) => changes.push(val)} />
    )

    tui.keys.press('x')
    await tui.flush()
    tui.keys.press('y')
    await tui.flush()

    expect(changes).toContain('x')
    expect(changes).toContain('xy')
    tui.unmount()
  })

  test('controlled mode uses provided value', () => {
    const tui = renderTui(<TextInput value="controlled" onChange={() => {}} />)
    expect(tui.screen.contains('controlled')).toBe(true)
    tui.unmount()
  })
})
