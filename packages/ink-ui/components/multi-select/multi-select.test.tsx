import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { setupHappyDom, renderForTest } from '../../test/utils'
import { MultiSelect } from './multi-select'

beforeAll(() => {
  setupHappyDom()
})

const testItems = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
]

describe('MultiSelect Component', () => {
  test('renders all items', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(<MultiSelect items={testItems} />)
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders with default selected items', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <MultiSelect items={testItems} defaultSelected={[testItems[0]!]} />
    )
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders with limit', async () => {
    const manyItems = [
      { label: 'Item 1', value: '1' },
      { label: 'Item 2', value: '2' },
      { label: 'Item 3', value: '3' },
      { label: 'Item 4', value: '4' },
      { label: 'Item 5', value: '5' },
    ]
    const { stdout, cleanup, waitForRender } = renderForTest(<MultiSelect items={manyItems} limit={3} />)
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders empty list', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(<MultiSelect items={[]} />)
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })
})
