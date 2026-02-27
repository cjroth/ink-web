import React, { useState, useCallback } from 'react'
import { Box, Text, useInput } from 'ink'

export type SelectInputItem<V> = {
  key?: string
  label: string
  value: V
}

export interface IndicatorProps {
  readonly isSelected?: boolean
}

export interface ItemProps {
  readonly isSelected?: boolean
  readonly label: string
}

function DefaultIndicator({ isSelected = false }: IndicatorProps) {
  return (
    <Box marginRight={1}>
      {isSelected ? (
        <Text color="cyan">▸</Text>
      ) : (
        <Text> </Text>
      )}
    </Box>
  )
}

function DefaultItem({ isSelected = false, label }: ItemProps) {
  return <Text color={isSelected ? 'blue' : undefined}>{label}</Text>
}

export interface SelectInputProps<V> {
  items?: SelectInputItem<V>[]
  focus?: boolean
  initialIndex?: number
  limit?: number
  indicatorComponent?: React.FC<IndicatorProps>
  itemComponent?: React.FC<ItemProps>
  onSelect?: (item: SelectInputItem<V>) => void
  onHighlight?: (item: SelectInputItem<V>) => void
}

export function SelectInput<V>({
  items = [],
  focus = true,
  initialIndex = 0,
  limit,
  indicatorComponent: IndicatorComponent = DefaultIndicator,
  itemComponent: ItemComponent = DefaultItem,
  onSelect,
  onHighlight,
}: SelectInputProps<V>) {
  // Calculate visible range
  const visibleCount = limit && limit < items.length ? limit : items.length
  const clampedInitial = Math.min(initialIndex, items.length - 1)

  const [selectedIndex, setSelectedIndex] = useState(Math.max(0, clampedInitial))
  const [scrollOffset, setScrollOffset] = useState(
    limit ? Math.max(0, clampedInitial - Math.floor(limit / 2)) : 0
  )

  // Get visible items based on scroll offset
  const visibleItems = limit
    ? items.slice(scrollOffset, scrollOffset + visibleCount)
    : items

  // Calculate the index within visible items
  const visibleSelectedIndex = selectedIndex - scrollOffset

  useInput(
    useCallback(
      (input, key) => {
        if (input === 'k' || key.upArrow) {
          const newIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1
          setSelectedIndex(newIndex)

          // Update scroll offset if needed
          if (limit && newIndex < scrollOffset) {
            setScrollOffset(newIndex)
          } else if (limit && newIndex >= items.length - 1 && scrollOffset + visibleCount < items.length) {
            setScrollOffset(Math.max(0, items.length - visibleCount))
          }

          onHighlight?.(items[newIndex]!)
        }

        if (input === 'j' || key.downArrow) {
          const newIndex = selectedIndex < items.length - 1 ? selectedIndex + 1 : 0
          setSelectedIndex(newIndex)

          // Update scroll offset if needed
          if (limit && newIndex >= scrollOffset + visibleCount) {
            setScrollOffset(newIndex - visibleCount + 1)
          } else if (limit && newIndex === 0) {
            setScrollOffset(0)
          }

          onHighlight?.(items[newIndex]!)
        }

        if (key.return) {
          onSelect?.(items[selectedIndex]!)
        }
      },
      [selectedIndex, scrollOffset, items, limit, visibleCount, onSelect, onHighlight]
    ),
    { isActive: focus }
  )

  return (
    <Box flexDirection="column">
      {visibleItems.map((item, index) => {
        const isSelected = index === visibleSelectedIndex
        const { key: itemKey, ...itemProps } = item
        const key = itemKey ?? `item-${scrollOffset + index}`
        return (
          <Box key={key}>
            <IndicatorComponent isSelected={isSelected} />
            <ItemComponent {...itemProps} isSelected={isSelected} />
          </Box>
        )
      })}
    </Box>
  )
}

export default SelectInput
