import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { Text } from 'ink'
import { setupHappyDom, renderForTest } from '../../test/utils'
import { StatusBar } from './status-bar'

beforeAll(() => {
  setupHappyDom()
})

describe('StatusBar Component', () => {
  test('renders items with keys and labels', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <StatusBar items={[
        { key: 'q', label: 'quit' },
        { key: 'Tab', label: 'switch focus' },
      ]} />
    )
    await waitForRender()
    const output = stdout.output()
    expect(output).toContain('q: quit')
    expect(output).toContain('Tab: switch focus')
    cleanup()
  })

  test('renders extra content with separator', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <StatusBar
        extra={<Text bold>Total: $1,000.00</Text>}
        items={[{ key: 'q', label: 'quit' }]}
      />
    )
    await waitForRender()
    const output = stdout.output()
    expect(output).toContain('Total: $1,000.00')
    expect(output).toContain('q: quit')
    cleanup()
  })

  test('renders without extra', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <StatusBar items={[{ key: 'Enter', label: 'select' }]} />
    )
    await waitForRender()
    expect(stdout.output()).toContain('Enter: select')
    cleanup()
  })

  test('renders with custom separator', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <StatusBar
        items={[
          { key: 'a', label: 'action1' },
          { key: 'b', label: 'action2' },
        ]}
        separator=" | "
      />
    )
    await waitForRender()
    const output = stdout.output()
    expect(output).toContain('a: action1')
    expect(output).toContain('b: action2')
    cleanup()
  })
})
