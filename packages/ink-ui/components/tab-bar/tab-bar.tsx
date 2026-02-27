import React from 'react'
import { Box, Text } from 'ink'

export interface TabBarProps {
  /** Label shown before the options (e.g., "View", "Mode") */
  label?: string
  /** The options to display */
  options: string[]
  /** Index of the currently selected option */
  selectedIndex: number
  /** Whether this tab bar is currently focused (affects visual styling) */
  focused?: boolean
  /** Color for the selected tab when focused */
  activeColor?: string
}

export function TabBar({
  label,
  options,
  selectedIndex,
  focused = true,
  activeColor = 'cyan',
}: TabBarProps) {
  return (
    <Box>
      {label && (
        <Text dimColor={!focused} bold={focused}>
          {label}
        </Text>
      )}
      <Text> </Text>
      {options.map((opt, i) => {
        const selected = i === selectedIndex
        return (
          <React.Fragment key={opt}>
            {selected ? (
              <Text
                inverse
                bold
                color={focused ? activeColor : undefined}
                dimColor={!focused}
              >
                {' '}{opt}{' '}
              </Text>
            ) : (
              <Text dimColor={!focused}>
                {' '}{opt}{' '}
              </Text>
            )}
          </React.Fragment>
        )
      })}
    </Box>
  )
}

export default TabBar
