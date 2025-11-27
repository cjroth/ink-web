/**
 * Table component for ink-web
 */

import React from 'react'
import { Box, Text } from 'ink'

type Scalar = string | number | boolean | null | undefined

type ScalarDict = {
  [key: string]: Scalar
}

export type CellProps = React.PropsWithChildren<{ column: number }>

export type TableProps<T extends ScalarDict> = {
  data: T[]
  columns?: (keyof T)[]
  padding?: number
  header?: (props: React.PropsWithChildren<{}>) => React.ReactElement
  cell?: (props: CellProps) => React.ReactElement
  skeleton?: (props: React.PropsWithChildren<{}>) => React.ReactElement
}

function Header(props: React.PropsWithChildren<{}>) {
  return (
    <Text bold color="blue">
      {props.children}
    </Text>
  )
}

function Cell(props: CellProps) {
  return <Text>{props.children}</Text>
}

function Skeleton(props: React.PropsWithChildren<{}>) {
  return <Text bold>{props.children}</Text>
}

type ColumnInfo<T> = {
  key: string
  field: keyof T
  width: number
}

export function Table<T extends ScalarDict>({
  data,
  columns: columnsProp,
  padding = 1,
  header = Header,
  cell = Cell,
  skeleton = Skeleton,
}: TableProps<T>) {
  // Determine which columns to display
  const getColumns = (): (keyof T)[] => {
    if (columnsProp) return columnsProp

    const keys = new Set<keyof T>()
    for (const row of data) {
      for (const key in row) {
        keys.add(key)
      }
    }
    return Array.from(keys)
  }

  const columns = getColumns()

  // Calculate column widths
  const calculateColumnWidths = (): ColumnInfo<T>[] => {
    return columns.map((field) => {
      const headerWidth = String(field).length
      const maxDataWidth = Math.max(
        ...data.map((row) => {
          const value = row[field]
          return value == null ? 0 : String(value).length
        }),
        0
      )
      return {
        field,
        key: String(field),
        width: Math.max(headerWidth, maxDataWidth) + padding * 2,
      }
    })
  }

  const columnInfo = calculateColumnWidths()

  // Render a single row with configurable borders and cell renderer
  const renderRow = (
    rowData: Partial<T>,
    borders: { left: string; right: string; cross: string; fill: string },
    CellComponent: React.FC<any>
  ) => {
    const cells: React.ReactNode[] = []

    columnInfo.forEach((col, index) => {
      const value = rowData[col.field]
      const content = value == null ? borders.fill.repeat(col.width) : formatCell(value, col.width, borders.fill)

      cells.push(
        <CellComponent key={`${col.key}-${index}`} column={index}>
          {content}
        </CellComponent>
      )

      // Add separator between columns
      if (index < columnInfo.length - 1) {
        cells.push(<Skeleton key={`sep-${index}`}>{borders.cross}</Skeleton>)
      }
    })

    return (
      <Box flexDirection="row">
        <Skeleton>{borders.left}</Skeleton>
        {cells}
        <Skeleton>{borders.right}</Skeleton>
      </Box>
    )
  }

  // Format cell content with padding
  const formatCell = (value: Scalar, width: number, fill: string): string => {
    const str = String(value)
    const leftPad = padding
    const rightPad = width - str.length - padding
    return `${fill.repeat(leftPad)}${str}${fill.repeat(rightPad)}`
  }

  // Create header data
  const headerData = columns.reduce(
    (acc, col) => ({ ...acc, [col]: col }),
    {} as Partial<T>
  )

  return (
    <Box flexDirection="column">
      {/* Top border */}
      {renderRow({}, { left: '┌', right: '┐', cross: '┬', fill: '─' }, skeleton)}

      {/* Header row */}
      {renderRow(headerData, { left: '│', right: '│', cross: '│', fill: ' ' }, header)}

      {/* Data rows with separators */}
      {data.map((row, index) => (
        <Box flexDirection="column" key={`row-${index}`}>
          {renderRow({}, { left: '├', right: '┤', cross: '┼', fill: '─' }, skeleton)}
          {renderRow(row, { left: '│', right: '│', cross: '│', fill: ' ' }, cell)}
        </Box>
      ))}

      {/* Bottom border */}
      {renderRow({}, { left: '└', right: '┘', cross: '┴', fill: '─' }, skeleton)}
    </Box>
  )
}

export default Table
export { Header, Cell, Skeleton }
