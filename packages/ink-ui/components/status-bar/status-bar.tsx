/**
 * Status Bar component for ink-web
 *
 * Displays keybinding hints and contextual information at the bottom of a TUI.
 */

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
  /** Separator between items (default: " · ") */
  separator?: string
}

export function StatusBar({
  items,
  extra,
  separator = ' · ',
}: StatusBarProps) {
  return (
    <Box flexDirection="column">
      <Box gap={2}>
        {extra}
        {extra && <Text dimColor>│</Text>}
        <Text dimColor>
          {items.map((item, i) => (
            <React.Fragment key={item.key + item.label}>
              {i > 0 && separator}
              {item.key}: {item.label}
            </React.Fragment>
          ))}
        </Text>
      </Box>
    </Box>
  )
}

export default StatusBar
