import React from 'react'
import { Box, Text } from 'ink'

export interface TabBarProps {
  label?: string
  options: string[]
  selectedIndex: number
  focused?: boolean
  activeColor?: string
}

export function TabBar({ label, options, selectedIndex, focused = true, activeColor = 'cyan' }: TabBarProps) {
  return (
    <Box>
      {label != null && (
        <Text dimColor={!focused} bold={focused}>
          {label}:{' '}
        </Text>
      )}
      {options.map((opt, i) => {
        const selected = i === selectedIndex
        return (
          <React.Fragment key={opt}>
            {selected ? (
              <Text inverse bold color={focused ? activeColor : undefined} dimColor={!focused}>
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
