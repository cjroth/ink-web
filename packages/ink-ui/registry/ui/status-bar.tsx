import React from 'react'
import { Box, Text } from 'ink'

export interface StatusBarItem {
  key: string
  label: string
}

export interface StatusBarProps {
  items: StatusBarItem[]
  extra?: React.ReactNode
  separator?: string
}

export function StatusBar({ items, extra, separator = ' \u00b7 ' }: StatusBarProps) {
  return (
    <Box gap={2}>
      {extra != null && (
        <>
          {extra}
          <Text dimColor>{'\u2502'}</Text>
        </>
      )}
      <Text dimColor>
        {items.map((item, i) => (
          <React.Fragment key={item.key}>
            {i > 0 && separator}
            {item.key}: {item.label}
          </React.Fragment>
        ))}
      </Text>
    </Box>
  )
}

export default StatusBar
