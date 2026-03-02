import { describe, expect, test, afterEach } from 'bun:test'
import React from 'react'
import { renderTui, cleanup } from 'ink-testing'
import { Table } from './table.tsx'

afterEach(() => {
  cleanup()
})

describe('Table', () => {
  test('simple data mode renders headers and values', () => {
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]
    const tui = renderTui(<Table data={data} />)
    expect(tui.screen.contains('name')).toBe(true)
    expect(tui.screen.contains('age')).toBe(true)
    expect(tui.screen.contains('Alice')).toBe(true)
    expect(tui.screen.contains('Bob')).toBe(true)
    expect(tui.screen.contains('30')).toBe(true)
    expect(tui.screen.contains('25')).toBe(true)
    tui.unmount()
  })

  test('simple data mode with column subset', () => {
    const data = [
      { name: 'Alice', age: 30, city: 'NYC' },
      { name: 'Bob', age: 25, city: 'LA' },
    ]
    const tui = renderTui(<Table data={data} columns={['name', 'city']} />)
    expect(tui.screen.contains('name')).toBe(true)
    expect(tui.screen.contains('city')).toBe(true)
    expect(tui.screen.contains('Alice')).toBe(true)
    expect(tui.screen.contains('NYC')).toBe(true)
    expect(tui.screen.contains('age')).toBe(false)
    tui.unmount()
  })

  test('advanced mode with columns and rows', () => {
    const columns = [
      { header: 'Name' },
      { header: 'Score', align: 'right' as const },
    ]
    const rows = [
      [{ text: 'Alice' }, { text: '95' }],
      [{ text: 'Bob' }, { text: '87' }],
    ]
    const tui = renderTui(<Table columns={columns} rows={rows} />)
    expect(tui.screen.contains('Name')).toBe(true)
    expect(tui.screen.contains('Score')).toBe(true)
    expect(tui.screen.contains('Alice')).toBe(true)
    expect(tui.screen.contains('95')).toBe(true)
    tui.unmount()
  })

  test('renders borders', () => {
    const data = [{ x: '1' }]
    const tui = renderTui(<Table data={data} />)
    expect(tui.screen.contains('╭')).toBe(true)
    expect(tui.screen.contains('╰')).toBe(true)
    tui.unmount()
  })

  test('renders footer rows', () => {
    const columns = [{ header: 'Item' }, { header: 'Price' }]
    const rows = [
      [{ text: 'Widget' }, { text: '$10' }],
    ]
    const footerRows = [
      [{ text: 'Total', bold: true }, { text: '$10', bold: true }],
    ]
    const tui = renderTui(
      <Table columns={columns} rows={rows} footerRows={footerRows} />
    )
    expect(tui.screen.contains('Total')).toBe(true)
    tui.unmount()
  })

  test('empty data renders borders', () => {
    const tui = renderTui(<Table data={[]} />)
    expect(tui.screen.contains('╭')).toBe(true)
    expect(tui.screen.contains('╰')).toBe(true)
    tui.unmount()
  })
})
