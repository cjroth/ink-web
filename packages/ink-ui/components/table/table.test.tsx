import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { setupHappyDom, renderForTest } from '../../test/utils'
import { Table } from './table'

beforeAll(() => {
  setupHappyDom()
})

const testData = [
  { name: 'Alice', age: 30, city: 'NYC' },
  { name: 'Bob', age: 25, city: 'LA' },
  { name: 'Charlie', age: 35, city: 'Chicago' },
]

describe('Table Component', () => {
  test('renders table with data', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(<Table data={testData} />)
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders with specific columns', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Table data={testData} columns={['name', 'age']} />
    )
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders empty table', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(<Table data={[]} />)
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders with custom padding', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(<Table data={testData} padding={2} />)
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })
})
