import { describe, expect, test, afterEach } from 'bun:test'
import React from 'react'
import { renderTui, cleanup } from 'ink-testing'
import { TabBar } from './tab-bar.tsx'

afterEach(() => {
  cleanup()
})

describe('TabBar', () => {
  const options = ['Files', 'Search', 'Settings']

  test('renders all options', () => {
    const tui = renderTui(
      <TabBar options={options} selectedIndex={0} />
    )
    expect(tui.screen.contains('Files')).toBe(true)
    expect(tui.screen.contains('Search')).toBe(true)
    expect(tui.screen.contains('Settings')).toBe(true)
    tui.unmount()
  })

  test('renders label when provided', () => {
    const tui = renderTui(
      <TabBar label="View:" options={options} selectedIndex={0} />
    )
    expect(tui.screen.contains('View:')).toBe(true)
    tui.unmount()
  })

  test('changing selectedIndex updates display', () => {
    const tui = renderTui(
      <TabBar options={options} selectedIndex={0} />
    )
    expect(tui.screen.contains('Files')).toBe(true)

    tui.rerender(
      <TabBar options={options} selectedIndex={2} />
    )
    expect(tui.screen.contains('Settings')).toBe(true)
    tui.unmount()
  })

  test('renders without label', () => {
    const tui = renderTui(
      <TabBar options={options} selectedIndex={1} />
    )
    expect(tui.screen.contains('Search')).toBe(true)
    tui.unmount()
  })
})
