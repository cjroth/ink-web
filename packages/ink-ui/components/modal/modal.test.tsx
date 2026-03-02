import { describe, expect, test, afterEach } from 'bun:test'
import React from 'react'
import { Text } from 'ink'
import { renderTui, cleanup } from 'ink-testing'
import { Modal } from './modal.tsx'

afterEach(() => {
  cleanup()
})

describe('Modal', () => {
  test('renders children content', () => {
    const tui = renderTui(
      <Modal>
        <Text>Modal content here</Text>
      </Modal>
    )
    expect(tui.screen.contains('Modal content here')).toBe(true)
    tui.unmount()
  })

  test('renders title when provided', () => {
    const tui = renderTui(
      <Modal title="My Modal">
        <Text>Body</Text>
      </Modal>
    )
    expect(tui.screen.contains('My Modal')).toBe(true)
    expect(tui.screen.contains('Body')).toBe(true)
    tui.unmount()
  })

  test('Escape key calls onClose', async () => {
    let closed = false
    const tui = renderTui(
      <Modal onClose={() => { closed = true }}>
        <Text>Content</Text>
      </Modal>
    )

    tui.keys.escape()
    await tui.flush()
    expect(closed).toBe(true)
    tui.unmount()
  })

  test('renders without title', () => {
    const tui = renderTui(
      <Modal>
        <Text>No title</Text>
      </Modal>
    )
    expect(tui.screen.contains('No title')).toBe(true)
    tui.unmount()
  })
})
