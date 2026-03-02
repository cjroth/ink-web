import { describe, expect, test, afterEach } from 'bun:test'
import React from 'react'
import { renderTui, cleanup } from 'ink-testing'
import { Spinner } from './spinner.tsx'

afterEach(() => {
  cleanup()
})

describe('Spinner', () => {
  test('renders spinner with default text', () => {
    const tui = renderTui(<Spinner />)
    expect(tui.screen.contains('Loading')).toBe(true)
    tui.unmount()
  })

  test('renders spinner with custom text', () => {
    const tui = renderTui(<Spinner text="Processing..." />)
    expect(tui.screen.contains('Processing...')).toBe(true)
    tui.unmount()
  })

  test('renders a braille spinner character', () => {
    const tui = renderTui(<Spinner />)
    expect(tui.screen.matches(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/)).toBe(true)
    tui.unmount()
  })
})
