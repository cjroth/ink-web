/**
 * Multi Select component for ink-web
 */

import React, { useState, useCallback } from 'react'
import { Box, Text, useInput } from 'ink'

export type MultiSelectItem<V> = {
  key?: string
  label: string
  value: V
}

export interface IndicatorProps {
  readonly isHighlighted?: boolean
}

export interface CheckboxProps {
  readonly isSelected?: boolean
}

export interface ItemProps {
  readonly isHighlighted?: boolean
  readonly label: string
}

function DefaultIndicator({ isHighlighted = false }: IndicatorProps) {
  return (
    <Box marginRight={1}>
      <Text color={isHighlighted ? 'blue' : undefined}>
        {isHighlighted ? '❯' : ' '}
      </Text>
    </Box>
  )
}

function DefaultCheckbox({ isSelected = false }: CheckboxProps) {
  return (
    <Box marginRight={1}>
      <Text color="green">
        {isSelected ? '◉' : '◯'}
      </Text>
    </Box>
  )
}

function DefaultItem({ isHighlighted = false, label }: ItemProps) {
  return <Text color={isHighlighted ? 'blue' : undefined}>{label}</Text>
}

export interface MultiSelectProps<V> {
  items?: MultiSelectItem<V>[]
  selected?: MultiSelectItem<V>[]
  defaultSelected?: MultiSelectItem<V>[]
  focus?: boolean
  initialIndex?: number
  limit?: number
  indicatorComponent?: React.FC<IndicatorProps>
  checkboxComponent?: React.FC<CheckboxProps>
  itemComponent?: React.FC<ItemProps>
  onSelect?: (item: MultiSelectItem<V>) => void
  onUnselect?: (item: MultiSelectItem<V>) => void
  onSubmit?: (items: MultiSelectItem<V>[]) => void
  onHighlight?: (item: MultiSelectItem<V>) => void
}

export function MultiSelect<V>({
  items = [],
  selected: controlledSelected,
  defaultSelected = [],
  focus = true,
  initialIndex = 0,
  limit,
  indicatorComponent: IndicatorComponent = DefaultIndicator,
  checkboxComponent: CheckboxComponent = DefaultCheckbox,
  itemComponent: ItemComponent = DefaultItem,
  onSelect,
  onUnselect,
  onSubmit,
  onHighlight,
}: MultiSelectProps<V>) {
  // Calculate visible range
  const visibleCount = limit && limit < items.length ? limit : items.length
  const clampedInitial = Math.min(initialIndex, items.length - 1)

  const [highlightedIndex, setHighlightedIndex] = useState(Math.max(0, clampedInitial))
  const [scrollOffset, setScrollOffset] = useState(
    limit ? Math.max(0, clampedInitial - Math.floor(limit / 2)) : 0
  )
  const [internalSelected, setInternalSelected] = useState<MultiSelectItem<V>[]>(defaultSelected)

  const selected = controlledSelected ?? internalSelected

  const isSelected = useCallback(
    (value: V) => {
      return selected.some(item => item.value === value)
    },
    [selected]
  )

  // Get visible items based on scroll offset
  const visibleItems = limit
    ? items.slice(scrollOffset, scrollOffset + visibleCount)
    : items

  // Calculate the index within visible items
  const visibleHighlightedIndex = highlightedIndex - scrollOffset

  useInput(
    useCallback(
      (input, key) => {
        if (input === 'k' || key.upArrow) {
          const newIndex = highlightedIndex > 0 ? highlightedIndex - 1 : items.length - 1
          setHighlightedIndex(newIndex)

          // Update scroll offset if needed
          if (limit && newIndex < scrollOffset) {
            setScrollOffset(newIndex)
          } else if (limit && newIndex >= items.length - 1 && scrollOffset + visibleCount < items.length) {
            setScrollOffset(Math.max(0, items.length - visibleCount))
          }

          onHighlight?.(items[newIndex]!)
        }

        if (input === 'j' || key.downArrow) {
          const newIndex = highlightedIndex < items.length - 1 ? highlightedIndex + 1 : 0
          setHighlightedIndex(newIndex)

          // Update scroll offset if needed
          if (limit && newIndex >= scrollOffset + visibleCount) {
            setScrollOffset(newIndex - visibleCount + 1)
          } else if (limit && newIndex === 0) {
            setScrollOffset(0)
          }

          onHighlight?.(items[newIndex]!)
        }

        if (input === ' ') {
          const item = items[highlightedIndex]
          if (!item) return

          if (isSelected(item.value)) {
            onUnselect?.(item)
            const newSelected = selected.filter(s => s.value !== item.value)
            if (!controlledSelected) {
              setInternalSelected(newSelected)
            }
          } else {
            onSelect?.(item)
            const newSelected = [...selected, item]
            if (!controlledSelected) {
              setInternalSelected(newSelected)
            }
          }
        }

        if (key.return) {
          onSubmit?.(selected)
        }
      },
      [
        highlightedIndex,
        scrollOffset,
        items,
        limit,
        visibleCount,
        selected,
        controlledSelected,
        isSelected,
        onSelect,
        onUnselect,
        onSubmit,
        onHighlight,
      ]
    ),
    { isActive: focus }
  )

  return (
    <Box flexDirection="column">
      {visibleItems.map((item, index) => {
        const actualIndex = scrollOffset + index
        const isHighlighted = index === visibleHighlightedIndex
        const itemIsSelected = isSelected(item.value)
        return (
          <Box key={item.key ?? String(item.value)}>
            <IndicatorComponent isHighlighted={isHighlighted} />
            <CheckboxComponent isSelected={itemIsSelected} />
            <ItemComponent {...item} isHighlighted={isHighlighted} />
          </Box>
        )
      })}
    </Box>
  )
}

export default MultiSelect
