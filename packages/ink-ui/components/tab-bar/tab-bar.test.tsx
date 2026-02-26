import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { setupHappyDom, renderForTest } from '../../test/utils'
import { TabBar } from './tab-bar'

beforeAll(() => {
  setupHappyDom()
})

describe('TabBar Component', () => {
  test('renders options with selected highlight', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <TabBar options={['Alpha', 'Beta', 'Gamma']} selectedIndex={1} />
    )
    await waitForRender()
    const output = stdout.output()
    expect(output).toContain('Alpha')
    expect(output).toContain('Beta')
    expect(output).toContain('Gamma')
    cleanup()
  })

  test('renders label when provided', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <TabBar label="View" options={['One', 'Two']} selectedIndex={0} />
    )
    await waitForRender()
    expect(stdout.output()).toContain('View')
    cleanup()
  })

  test('renders without label', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <TabBar options={['A', 'B']} selectedIndex={0} />
    )
    await waitForRender()
    const output = stdout.output()
    expect(output).toContain('A')
    expect(output).toContain('B')
    cleanup()
  })

  test('renders dimmed when unfocused', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <TabBar options={['X', 'Y']} selectedIndex={0} focused={false} />
    )
    await waitForRender()
    expect(stdout.output()).toContain('X')
    cleanup()
  })

  test('renders with custom activeColor', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <TabBar options={['A', 'B']} selectedIndex={0} activeColor="green" />
    )
    await waitForRender()
    expect(stdout.output()).toContain('A')
    cleanup()
  })
})
