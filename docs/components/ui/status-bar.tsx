import React, { type ReactNode } from 'react'
import { Box, Text } from 'ink'

export interface StatusBarItem {
  /** The key or key combination (e.g., "Tab", "←→", "q") */
  key: string
  /** Description of the action (e.g., "switch focus", "quit") */
  label: string
}

export interface StatusBarProps {
  /** Keybinding hints to display */
  items: StatusBarItem[]
  /** Optional extra content to display before the keybinding hints */
  extra?: ReactNode
}

export function StatusBar({
  items,
  extra,
}: StatusBarProps) {
  return (
    <Box gap={2}>
      {extra}
      {extra && <Text dimColor>│</Text>}
      <Box gap={1}>
        {items.map((item) => (
          <Box key={item.key + item.label} gap={0}>
            <Text inverse bold> {item.key} </Text>
            <Text dimColor> {item.label}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default StatusBar
