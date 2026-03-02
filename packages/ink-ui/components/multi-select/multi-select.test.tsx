import { describe, expect, test, afterEach } from 'bun:test'
import React from 'react'
import { renderTui, cleanup } from 'ink-testing'
import { MultiSelect } from './multi-select.tsx'

afterEach(() => {
  cleanup()
})

const items = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]

describe('MultiSelect', () => {
  test('renders all items', () => {
    const tui = renderTui(<MultiSelect items={items} />)
    expect(tui.screen.contains('Apple')).toBe(true)
    expect(tui.screen.contains('Banana')).toBe(true)
    expect(tui.screen.contains('Cherry')).toBe(true)
    tui.unmount()
  })

  test('shows unselected checkboxes initially', () => {
    const tui = renderTui(<MultiSelect items={items} />)
    expect(tui.screen.contains('◯')).toBe(true)
    tui.unmount()
  })

  test('space toggles selection on', async () => {
    const tui = renderTui(<MultiSelect items={items} />)

    tui.keys.space()
    await tui.flush()
    expect(tui.screen.contains('◉')).toBe(true)
    tui.unmount()
  })

  test('space toggles selection off', async () => {
    const tui = renderTui(<MultiSelect items={items} />)

    tui.keys.space()
    await tui.flush()
    expect(tui.screen.contains('◉')).toBe(true)

    tui.keys.space()
    await tui.flush()
    expect(tui.screen.contains('◉')).toBe(false)
    tui.unmount()
  })

  test('arrow navigation changes highlighted item', async () => {
    const highlights: string[] = []
    const tui = renderTui(
      <MultiSelect
        items={items}
        onHighlight={(item) => highlights.push(item.label)}
      />
    )

    tui.keys.down()
    await tui.flush()
    expect(highlights).toContain('Banana')

    tui.keys.down()
    await tui.flush()
    expect(highlights).toContain('Cherry')
    tui.unmount()
  })

  test('Enter submits selected items', async () => {
    let submitted: typeof items | undefined
    const tui = renderTui(
      <MultiSelect
        items={items}
        onSubmit={(selected) => { submitted = selected }}
      />
    )

    tui.keys.space()
    await tui.flush()

    tui.keys.down()
    await tui.flush()
    tui.keys.down()
    await tui.flush()
    tui.keys.space()
    await tui.flush()

    tui.keys.enter()
    await tui.flush()

    expect(submitted).toBeDefined()
    expect(submitted!.length).toBe(2)
    expect(submitted!.map(s => s.label)).toContain('Apple')
    expect(submitted!.map(s => s.label)).toContain('Cherry')
    tui.unmount()
  })

  test('j/k navigation works', async () => {
    const highlights: string[] = []
    const tui = renderTui(
      <MultiSelect
        items={items}
        onHighlight={(item) => highlights.push(item.label)}
      />
    )

    tui.keys.press('j')
    await tui.flush()
    expect(highlights).toContain('Banana')

    tui.keys.press('k')
    await tui.flush()
    expect(highlights).toContain('Apple')
    tui.unmount()
  })

  test('focus=false disables input', async () => {
    let submitted: typeof items | undefined
    const tui = renderTui(
      <MultiSelect
        items={items}
        focus={false}
        onSubmit={(selected) => { submitted = selected }}
      />
    )

    tui.keys.space()
    await tui.flush()
    tui.keys.enter()
    await tui.flush()
    expect(submitted).toBeUndefined()
    tui.unmount()
  })
})
