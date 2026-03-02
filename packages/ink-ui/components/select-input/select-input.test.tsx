import { describe, expect, test, afterEach } from 'bun:test'
import React from 'react'
import { renderTui, cleanup } from 'ink-testing'
import { SelectInput } from './select-input.tsx'

afterEach(() => {
  cleanup()
})

const items = [
  { label: 'First', value: 'first' },
  { label: 'Second', value: 'second' },
  { label: 'Third', value: 'third' },
]

describe('SelectInput', () => {
  test('renders all items', () => {
    const tui = renderTui(<SelectInput items={items} />)
    expect(tui.screen.contains('First')).toBe(true)
    expect(tui.screen.contains('Second')).toBe(true)
    expect(tui.screen.contains('Third')).toBe(true)
    tui.unmount()
  })

  test('highlights first item by default', () => {
    const tui = renderTui(<SelectInput items={items} />)
    expect(tui.screen.contains('▸')).toBe(true)
    tui.unmount()
  })

  test('navigates down with arrow key', async () => {
    const highlights: string[] = []
    const tui = renderTui(
      <SelectInput
        items={items}
        onHighlight={(item) => highlights.push(item.label)}
      />
    )

    tui.keys.down()
    await tui.flush()
    expect(highlights).toContain('Second')
    tui.unmount()
  })

  test('navigates down with j key', async () => {
    const highlights: string[] = []
    const tui = renderTui(
      <SelectInput
        items={items}
        onHighlight={(item) => highlights.push(item.label)}
      />
    )

    tui.keys.press('j')
    await tui.flush()
    expect(highlights).toContain('Second')
    tui.unmount()
  })

  test('navigates up with arrow key', async () => {
    const highlights: string[] = []
    const tui = renderTui(
      <SelectInput
        items={items}
        initialIndex={1}
        onHighlight={(item) => highlights.push(item.label)}
      />
    )

    tui.keys.up()
    await tui.flush()
    expect(highlights).toContain('First')
    tui.unmount()
  })

  test('navigates up with k key', async () => {
    const highlights: string[] = []
    const tui = renderTui(
      <SelectInput
        items={items}
        initialIndex={1}
        onHighlight={(item) => highlights.push(item.label)}
      />
    )

    tui.keys.press('k')
    await tui.flush()
    expect(highlights).toContain('First')
    tui.unmount()
  })

  test('wraps around when navigating past the end', async () => {
    const highlights: string[] = []
    const tui = renderTui(
      <SelectInput
        items={items}
        initialIndex={2}
        onHighlight={(item) => highlights.push(item.label)}
      />
    )

    tui.keys.down()
    await tui.flush()
    expect(highlights).toContain('First')
    tui.unmount()
  })

  test('wraps around when navigating before the start', async () => {
    const highlights: string[] = []
    const tui = renderTui(
      <SelectInput
        items={items}
        onHighlight={(item) => highlights.push(item.label)}
      />
    )

    tui.keys.up()
    await tui.flush()
    expect(highlights).toContain('Third')
    tui.unmount()
  })

  test('Enter calls onSelect with the highlighted item', async () => {
    let selected: string | undefined
    const tui = renderTui(
      <SelectInput
        items={items}
        onSelect={(item) => { selected = item.label }}
      />
    )

    tui.keys.enter()
    await tui.flush()
    expect(selected).toBe('First')
    tui.unmount()
  })

  test('navigating then selecting picks the right item', async () => {
    let selected: string | undefined
    const tui = renderTui(
      <SelectInput
        items={items}
        onSelect={(item) => { selected = item.label }}
      />
    )

    tui.keys.down()
    await tui.flush()
    tui.keys.enter()
    await tui.flush()
    expect(selected).toBe('Second')
    tui.unmount()
  })

  test('focus=false disables input', async () => {
    let selected: string | undefined
    const tui = renderTui(
      <SelectInput
        items={items}
        focus={false}
        onSelect={(item) => { selected = item.label }}
      />
    )

    tui.keys.enter()
    await tui.flush()
    expect(selected).toBeUndefined()
    tui.unmount()
  })

  test('initialIndex sets starting selection', () => {
    const tui = renderTui(
      <SelectInput items={items} initialIndex={2} />
    )
    const lines = tui.screen.lines()
    const thirdLine = lines.find(l => l.includes('Third'))
    expect(thirdLine).toBeDefined()
    tui.unmount()
  })
})
