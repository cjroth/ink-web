import { describe, expect, test, afterEach } from 'bun:test'
import React from 'react'
import { renderTui, cleanup } from 'ink-testing'
import { Ascii } from './ascii.tsx'

afterEach(() => {
  cleanup()
})

describe('Ascii', () => {
  test('renders ASCII art text', async () => {
    const tui = renderTui(<Ascii text="Hi" />)
    await tui.waitFor(() => {
      const lines = tui.screen.lines()
      expect(lines.length).toBeGreaterThan(1)
    })
    tui.unmount()
  })

  test('renders the actual text in ASCII art form', async () => {
    const tui = renderTui(<Ascii text="A" />)
    await tui.waitFor(() => {
      const text = tui.screen.text()
      expect(text.length).toBeGreaterThan(0)
      expect(tui.screen.lines().length).toBeGreaterThan(1)
    })
    tui.unmount()
  })
})
