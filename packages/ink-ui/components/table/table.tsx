import React, { type ReactNode } from 'react'
import { Box, Text } from 'ink'

// ── Shared types ──

export interface Column {
  header: string
  width?: number
  minWidth?: number
  align?: 'left' | 'right'
  headerColor?: string
}

export interface Cell {
  text: string
  color?: string
  bold?: boolean
  dimColor?: boolean
  /** Custom node for rendering. `text` is still required for width calculation. */
  node?: ReactNode
}

// ── Props union ──

type TableBaseProps = {
  padding?: number
  /** Max header width before truncating with … */
  maxHeaderWidth?: number
}

type SimpleTableProps<T> = TableBaseProps & {
  data: T[]
  columns?: (keyof T)[]
  rows?: never
  footerRows?: never
}

type AdvancedTableProps = TableBaseProps & {
  columns: Column[]
  rows: Cell[][]
  footerRows?: Cell[][]
  data?: never
}

export type TableProps<T extends Record<string, unknown> = Record<string, unknown>> =
  | SimpleTableProps<T>
  | AdvancedTableProps

// ── Helpers ──

function buildBorder(type: 'top' | 'mid' | 'bot', widths: number[]): string {
  const c = {
    top: { l: '╭', r: '╮', m: '┬', h: '─' },
    mid: { l: '├', r: '┤', m: '┼', h: '─' },
    bot: { l: '╰', r: '╯', m: '┴', h: '─' },
  }[type]
  return c.l + widths.map(w => c.h.repeat(w + 2)).join(c.m) + c.r
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

function computeWidths(columns: Column[], rows: Cell[][], footerRows: Cell[][], maxHeader: number): number[] {
  return columns.map((col, i) => {
    let w = Math.min(col.header.length, maxHeader)
    if (col.minWidth) w = Math.max(w, col.minWidth)
    for (const row of rows) {
      const cell = row[i]
      if (cell) w = Math.max(w, cell.text.length)
    }
    for (const row of footerRows) {
      const cell = row[i]
      if (cell) w = Math.max(w, cell.text.length)
    }
    return col.width ?? w
  })
}

function pad(s: string, w: number, align: 'left' | 'right'): string {
  return align === 'right' ? s.padStart(w) : s.padEnd(w)
}

function V() {
  return <Text dimColor>│</Text>
}

function renderRow(cells: Cell[], widths: number[], columns: Column[]) {
  return (
    <Box>
      {cells.map((cell, i) => {
        const w = widths[i]!
        const align = columns[i]?.align ?? 'left'
        return (
          <React.Fragment key={i}>
            <V />
            {cell.node ? (
              <Box width={w + 2} justifyContent={align === 'right' ? 'flex-end' : undefined}>
                <Text> </Text>
                {cell.node}
                {align === 'right' && <Text> </Text>}
              </Box>
            ) : (
              <Text
                color={cell.color as any}
                bold={cell.bold}
                dimColor={cell.dimColor}
              >
                {' '}{pad(cell.text, w, align)}{' '}
              </Text>
            )}
          </React.Fragment>
        )
      })}
      <V />
    </Box>
  )
}

// ── Simple → Advanced conversion ──

function toAdvanced<T extends Record<string, unknown>>(
  data: T[],
  columnKeys?: (keyof T)[],
): { columns: Column[]; rows: Cell[][] } {
  const keys: (keyof T)[] = columnKeys ?? Array.from(
    data.reduce((set, row) => {
      for (const k in row) set.add(k)
      return set
    }, new Set<keyof T>()),
  )

  const columns: Column[] = keys.map(k => ({ header: String(k) }))
  const rows: Cell[][] = data.map(row =>
    keys.map(k => ({ text: row[k] == null ? '' : String(row[k]) })),
  )

  return { columns, rows }
}

// ── Component ──

export function Table<T extends Record<string, unknown>>(props: TableProps<T>) {
  let columns: Column[]
  let rows: Cell[][]
  let footerRows: Cell[] [] = []
  let maxHeaderWidth: number

  if ('data' in props && props.data !== undefined) {
    const converted = toAdvanced(props.data, props.columns)
    columns = converted.columns
    rows = converted.rows
    maxHeaderWidth = props.maxHeaderWidth ?? Infinity
  } else {
    columns = (props as AdvancedTableProps).columns
    rows = (props as AdvancedTableProps).rows
    footerRows = (props as AdvancedTableProps).footerRows ?? []
    maxHeaderWidth = props.maxHeaderWidth ?? 8
  }

  const widths = computeWidths(columns, rows, footerRows, maxHeaderWidth)

  return (
    <Box flexDirection="column">
      <Text dimColor>{buildBorder('top', widths)}</Text>

      {/* Header */}
      <Box>
        {columns.map((col, i) => (
          <React.Fragment key={i}>
            <V />
            <Text bold color={col.headerColor as any}>
              {' '}{pad(truncate(col.header, maxHeaderWidth), widths[i]!, col.align ?? 'left')}{' '}
            </Text>
          </React.Fragment>
        ))}
        <V />
      </Box>

      <Text dimColor>{buildBorder('mid', widths)}</Text>

      {/* Data rows */}
      {rows.map((row, i) => (
        <React.Fragment key={i}>
          {renderRow(row, widths, columns)}
        </React.Fragment>
      ))}

      {/* Footer */}
      {footerRows.length > 0 && (
        <>
          <Text dimColor>{buildBorder('mid', widths)}</Text>
          {footerRows.map((row, i) => (
            <React.Fragment key={i}>
              {renderRow(row, widths, columns)}
            </React.Fragment>
          ))}
        </>
      )}

      <Text dimColor>{buildBorder('bot', widths)}</Text>
    </Box>
  )
}

export default Table
