/**
 * Table component for ink-web
 *
 * Based on ink-table by Matic Zavadlal
 * https://github.com/maticzav/ink-table
 * MIT License
 *
 * Adapted for browser compatibility with ink-web by removing Node.js dependencies.
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

function intersperse<T, I>(
  intersperser: (index: number) => I,
  elements: T[]
): (T | I)[] {
  let interspersed: (T | I)[] = elements.reduce((acc, element, index) => {
    if (acc.length === 0) return [element]
    return [...acc, intersperser(index), element]
  }, [] as (T | I)[])
  return interspersed
}

type RowConfig = {
  cell: (props: CellProps) => React.ReactElement
  padding: number
  skeleton: {
    component: (props: React.PropsWithChildren<{}>) => React.ReactElement
    left: string
    right: string
    cross: string
    line: string
  }
}

type Column<T> = {
  key: string
  column: keyof T
  width: number
}

type RowProps<T extends ScalarDict> = {
  rowKey: string
  data: Partial<T>
  columns: Column<T>[]
}

function createRow<T extends ScalarDict>(
  config: RowConfig
): (props: RowProps<T>) => React.ReactElement {
  const skeleton = config.skeleton

  return (props) => (
    <Box flexDirection="row">
      <skeleton.component>{skeleton.left}</skeleton.component>
      {...intersperse(
        (i) => {
          const key = `${props.rowKey}-hseparator-${i}`
          return (
            <skeleton.component key={key}>{skeleton.cross}</skeleton.component>
          )
        },
        props.columns.map((column, colI) => {
          const value = props.data[column.column]

          if (value == undefined || value == null) {
            const key = `${props.rowKey}-empty-${column.key}`
            return (
              <config.cell key={key} column={colI}>
                {skeleton.line.repeat(column.width)}
              </config.cell>
            )
          } else {
            const key = `${props.rowKey}-cell-${column.key}`
            const ml = config.padding
            const mr = column.width - String(value).length - config.padding
            return (
              <config.cell key={key} column={colI}>
                {`${skeleton.line.repeat(ml)}${String(value)}${skeleton.line.repeat(mr)}`}
              </config.cell>
            )
          }
        })
      )}
      <skeleton.component>{skeleton.right}</skeleton.component>
    </Box>
  )
}

export function Table<T extends ScalarDict>({
  data,
  columns: columnsProp,
  padding = 1,
  header = Header,
  cell = Cell,
  skeleton = Skeleton,
}: TableProps<T>) {
  const getDataKeys = (): (keyof T)[] => {
    let keys = new Set<keyof T>()
    for (const row of data) {
      for (const key in row) {
        keys.add(key)
      }
    }
    return Array.from(keys)
  }

  const columns = columnsProp || getDataKeys()

  const getColumns = (): Column<T>[] => {
    return columns.map((key) => {
      const headerWidth = String(key).length
      const dataWidths = data.map((row) => {
        const value = row[key]
        if (value == undefined || value == null) return 0
        return String(value).length
      })
      const width = Math.max(...dataWidths, headerWidth) + padding * 2
      return {
        column: key,
        width: width,
        key: String(key),
      }
    })
  }

  const getHeadings = (): Partial<T> => {
    return columns.reduce(
      (acc, column) => ({ ...acc, [column]: column }),
      {}
    )
  }

  const columnData = getColumns()
  const headings = getHeadings()

  const headerRow = createRow<T>({
    cell: skeleton,
    padding,
    skeleton: {
      component: skeleton,
      line: '─',
      left: '┌',
      right: '┐',
      cross: '┬',
    },
  })

  const headingRow = createRow<T>({
    cell: header,
    padding,
    skeleton: {
      component: skeleton,
      line: ' ',
      left: '│',
      right: '│',
      cross: '│',
    },
  })

  const separatorRow = createRow<T>({
    cell: skeleton,
    padding,
    skeleton: {
      component: skeleton,
      line: '─',
      left: '├',
      right: '┤',
      cross: '┼',
    },
  })

  const dataRow = createRow<T>({
    cell,
    padding,
    skeleton: {
      component: skeleton,
      line: ' ',
      left: '│',
      right: '│',
      cross: '│',
    },
  })

  const footerRow = createRow<T>({
    cell: skeleton,
    padding,
    skeleton: {
      component: skeleton,
      line: '─',
      left: '└',
      right: '┘',
      cross: '┴',
    },
  })

  return (
    <Box flexDirection="column">
      {headerRow({ rowKey: 'header', columns: columnData, data: {} })}
      {headingRow({ rowKey: 'heading', columns: columnData, data: headings })}
      {data.map((row, index) => {
        const key = `row-${index}`
        return (
          <Box flexDirection="column" key={key}>
            {separatorRow({ rowKey: `separator-${key}`, columns: columnData, data: {} })}
            {dataRow({ rowKey: `data-${key}`, columns: columnData, data: row })}
          </Box>
        )
      })}
      {footerRow({ rowKey: 'footer', columns: columnData, data: {} })}
    </Box>
  )
}

export default Table
export { Header, Cell, Skeleton }
