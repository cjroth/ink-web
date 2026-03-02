import { describe, expect, test, afterEach } from 'bun:test'
import React from 'react'
import { Text } from 'ink'
import { renderTui, cleanup } from 'ink-testing'
import { Gradient } from './gradient.tsx'

afterEach(() => {
  cleanup()
})

describe('Gradient', () => {
  test('renders gradient text with preset name', () => {
    const tui = renderTui(
      <Gradient name="rainbow">
        <Text>Hello World</Text>
      </Gradient>
    )
    expect(tui.screen.contains('Hello World')).toBe(true)
    tui.unmount()
  })

  test('renders gradient text with custom colors', () => {
    const tui = renderTui(
      <Gradient colors={['#ff0000', '#0000ff']}>
        <Text>Custom</Text>
      </Gradient>
    )
    expect(tui.screen.contains('Custom')).toBe(true)
    tui.unmount()
  })

  test('raw output contains ANSI color codes', () => {
    const tui = renderTui(
      <Gradient name="rainbow">
        <Text>Colored</Text>
      </Gradient>
    )
    expect(tui.screen.rawText()).toContain('\x1b[38;2;')
    tui.unmount()
  })

  test('different preset names produce output', () => {
    const presets = ['cristal', 'teen', 'morning', 'pastel'] as const
    for (const name of presets) {
      const tui = renderTui(
        <Gradient name={name}>
          <Text>Test</Text>
        </Gradient>
      )
      expect(tui.screen.contains('Test')).toBe(true)
      tui.unmount()
    }
  })

  test('single color gradient works', () => {
    const tui = renderTui(
      <Gradient colors={['#ff0000']}>
        <Text>Mono</Text>
      </Gradient>
    )
    expect(tui.screen.contains('Mono')).toBe(true)
    tui.unmount()
  })

  test('multiline text gets gradient applied', () => {
    const tui = renderTui(
      <Gradient name="rainbow">
        <Text>{'Line1\nLine2'}</Text>
      </Gradient>
    )
    expect(tui.screen.contains('Line1')).toBe(true)
    expect(tui.screen.contains('Line2')).toBe(true)
    tui.unmount()
  })
})
