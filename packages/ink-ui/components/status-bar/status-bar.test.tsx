import { describe, expect, test, afterEach } from 'bun:test'
import React from 'react'
import { Text } from 'ink'
import { renderTui, cleanup } from 'ink-testing'
import { StatusBar } from './status-bar.tsx'

afterEach(() => {
  cleanup()
})

describe('StatusBar', () => {
  test('renders keybinding hints', () => {
    const items = [
      { key: 'Tab', label: 'switch focus' },
      { key: 'q', label: 'quit' },
    ]
    const tui = renderTui(<StatusBar items={items} />)
    expect(tui.screen.contains('Tab')).toBe(true)
    expect(tui.screen.contains('switch focus')).toBe(true)
    expect(tui.screen.contains('q')).toBe(true)
    expect(tui.screen.contains('quit')).toBe(true)
    tui.unmount()
  })

  test('renders extra content with separator', () => {
    const items = [{ key: 'q', label: 'quit' }]
    const extra = <Text>Page 1 of 5</Text>
    const tui = renderTui(<StatusBar items={items} extra={extra} />)
    expect(tui.screen.contains('Page 1 of 5')).toBe(true)
    expect(tui.screen.contains('│')).toBe(true)
    expect(tui.screen.contains('quit')).toBe(true)
    tui.unmount()
  })

  test('renders without extra content', () => {
    const items = [{ key: 'Enter', label: 'select' }]
    const tui = renderTui(<StatusBar items={items} />)
    expect(tui.screen.contains('Enter')).toBe(true)
    expect(tui.screen.contains('select')).toBe(true)
    expect(tui.screen.contains('│')).toBe(false)
    tui.unmount()
  })

  test('updates when items change', () => {
    const items1 = [{ key: 'a', label: 'action1' }]
    const tui = renderTui(<StatusBar items={items1} />)
    expect(tui.screen.contains('action1')).toBe(true)

    const items2 = [{ key: 'b', label: 'action2' }]
    tui.rerender(<StatusBar items={items2} />)
    expect(tui.screen.contains('action2')).toBe(true)
    tui.unmount()
  })
})
