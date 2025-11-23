/**
 * Select Input component for ink-web
 *
 * Based on ink-select-input by Vadim Demedes
 * https://github.com/vadimdemedes/ink-select-input
 * MIT License - Copyright (c) Vadim Demedes <vadimdemedes@hey.com>
 *
 * Adapted for browser compatibility with ink-web by removing Node.js dependencies.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Text, useInput } from 'ink-web/bundled'

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
        <Text color="blue">❯</Text>
      ) : (
        <Text> </Text>
      )}
    </Box>
  )
}

function DefaultItem({ isSelected = false, label }: ItemProps) {
  return <Text color={isSelected ? 'blue' : undefined}>{label}</Text>
}

// Simple array rotation helper (replaces to-rotated)
function rotateArray<T>(array: T[], count: number): T[] {
  const len = array.length
  if (len === 0) return array
  const normalizedCount = ((count % len) + len) % len
  return [...array.slice(normalizedCount), ...array.slice(0, normalizedCount)]
}

// Deep equality check for arrays of items (replaces node:util)
function areItemsEqual<V>(a: SelectInputItem<V>[], b: SelectInputItem<V>[]): boolean {
  if (a.length !== b.length) return false
  return a.every((item, index) => {
    const other = b[index]
    return item.value === other?.value
  })
}

export interface SelectInputProps<V> {
  items?: SelectInputItem<V>[]
  isFocused?: boolean
  initialIndex?: number
  limit?: number
  indicatorComponent?: React.FC<IndicatorProps>
  itemComponent?: React.FC<ItemProps>
  onSelect?: (item: SelectInputItem<V>) => void
  onHighlight?: (item: SelectInputItem<V>) => void
}

export function SelectInput<V>({
  items = [],
  isFocused = true,
  initialIndex = 0,
  indicatorComponent: IndicatorComponent = DefaultIndicator,
  itemComponent: ItemComponent = DefaultItem,
  limit: customLimit,
  onSelect,
  onHighlight,
}: SelectInputProps<V>) {
  const hasLimit = typeof customLimit === 'number' && items.length > customLimit
  const limit = hasLimit ? Math.min(customLimit, items.length) : items.length
  const lastIndex = limit - 1
  const [rotateIndex, setRotateIndex] = useState(
    initialIndex > lastIndex ? lastIndex - initialIndex : 0
  )
  const [selectedIndex, setSelectedIndex] = useState(
    initialIndex ? (initialIndex > lastIndex ? lastIndex : initialIndex) : 0
  )
  const previousItems = useRef<SelectInputItem<V>[]>(items)

  useEffect(() => {
    if (!areItemsEqual(previousItems.current, items)) {
      setRotateIndex(0)
      setSelectedIndex(0)
    }
    previousItems.current = items
  }, [items])

  useInput(
    useCallback(
      (input, key) => {
        if (input === 'k' || key.upArrow) {
          const lastIdx = (hasLimit ? limit : items.length) - 1
          const atFirstIndex = selectedIndex === 0
          const nextIndex = hasLimit ? selectedIndex : lastIdx
          const nextRotateIndex = atFirstIndex ? rotateIndex + 1 : rotateIndex
          const nextSelectedIndex = atFirstIndex ? nextIndex : selectedIndex - 1

          setRotateIndex(nextRotateIndex)
          setSelectedIndex(nextSelectedIndex)

          const slicedItems = hasLimit
            ? rotateArray(items, nextRotateIndex).slice(0, limit)
            : items

          if (typeof onHighlight === 'function') {
            onHighlight(slicedItems[nextSelectedIndex]!)
          }
        }

        if (input === 'j' || key.downArrow) {
          const atLastIndex = selectedIndex === (hasLimit ? limit : items.length) - 1
          const nextIndex = hasLimit ? selectedIndex : 0
          const nextRotateIndex = atLastIndex ? rotateIndex - 1 : rotateIndex
          const nextSelectedIndex = atLastIndex ? nextIndex : selectedIndex + 1

          setRotateIndex(nextRotateIndex)
          setSelectedIndex(nextSelectedIndex)

          const slicedItems = hasLimit
            ? rotateArray(items, nextRotateIndex).slice(0, limit)
            : items

          if (typeof onHighlight === 'function') {
            onHighlight(slicedItems[nextSelectedIndex]!)
          }
        }

        if (/^[1-9]$/.test(input)) {
          const targetIndex = Number.parseInt(input, 10) - 1
          const visibleItems = hasLimit
            ? rotateArray(items, rotateIndex).slice(0, limit)
            : items

          if (targetIndex >= 0 && targetIndex < visibleItems.length) {
            const selectedItem = visibleItems[targetIndex]
            if (selectedItem) {
              onSelect?.(selectedItem)
            }
          }
        }

        if (key.return) {
          const slicedItems = hasLimit
            ? rotateArray(items, rotateIndex).slice(0, limit)
            : items

          if (typeof onSelect === 'function') {
            onSelect(slicedItems[selectedIndex]!)
          }
        }
      },
      [hasLimit, limit, rotateIndex, selectedIndex, items, onSelect, onHighlight]
    ),
    { isActive: isFocused }
  )

  const slicedItems = hasLimit
    ? rotateArray(items, rotateIndex).slice(0, limit)
    : items

  return (
    <Box flexDirection="column">
      {slicedItems.map((item, index) => {
        const isSelected = index === selectedIndex
        return (
          <Box key={item.key ?? String(item.value)}>
            <IndicatorComponent isSelected={isSelected} />
            <ItemComponent {...item} isSelected={isSelected} />
          </Box>
        )
      })}
    </Box>
  )
}

export default SelectInput
