import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { Text } from 'ink'
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

describe('Table – simple mode', () => {
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

describe('Table – advanced mode', () => {
  test('renders with columns and rows', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Table
        columns={[
          { header: 'Name' },
          { header: 'Price', align: 'right' },
        ]}
        rows={[
          [{ text: 'Widget' }, { text: '$10.00' }],
          [{ text: 'Gadget' }, { text: '$25.00' }],
        ]}
      />
    )
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders with footer rows', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Table
        columns={[
          { header: 'Item' },
          { header: 'Price', align: 'right' },
        ]}
        rows={[
          [{ text: 'Widget' }, { text: '$10.00' }],
          [{ text: 'Gadget' }, { text: '$25.00' }],
        ]}
        footerRows={[
          [{ text: 'Total', bold: true }, { text: '$35.00', bold: true }],
        ]}
      />
    )
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders with colored cells', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Table
        columns={[
          { header: 'Status', headerColor: 'cyan' },
          { header: 'Count', align: 'right' },
        ]}
        rows={[
          [{ text: 'Passing', color: 'green' }, { text: '42' }],
          [{ text: 'Failing', color: 'red' }, { text: '3' }],
          [{ text: 'Skipped', dimColor: true }, { text: '7' }],
        ]}
      />
    )
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders with custom node cells', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Table
        columns={[
          { header: 'Name' },
          { header: 'Bar' },
        ]}
        rows={[
          [{ text: 'Task 1' }, { text: '████░░', node: <Text color="green">████░░</Text> }],
        ]}
      />
    )
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('truncates long headers', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Table
        columns={[
          { header: 'A Very Long Header Name' },
          { header: 'Short' },
        ]}
        rows={[
          [{ text: 'a' }, { text: 'b' }],
        ]}
        maxHeaderWidth={10}
      />
    )
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })
})
