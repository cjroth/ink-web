import { describe, expect, test, afterEach } from 'bun:test'
import React from 'react'
import { renderTui, cleanup } from 'ink-testing'
import { Link } from './link.tsx'

afterEach(() => {
  cleanup()
})

describe('Link', () => {
  test('renders link text', () => {
    const tui = renderTui(<Link url="https://example.com">Click me</Link>)
    expect(tui.screen.contains('Click me')).toBe(true)
    tui.unmount()
  })

  test('raw output contains OSC 8 escape sequence with URL', () => {
    const tui = renderTui(<Link url="https://example.com">Example</Link>)
    const raw = tui.screen.rawText()
    expect(raw).toContain('https://example.com')
    expect(raw).toContain('\x1b]8;;')
    tui.unmount()
  })
})
