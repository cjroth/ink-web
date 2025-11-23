/**
 * Multi Select component for ink-web
 *
 * Based on ink-multi-select by George Karagkiaouris
 * https://github.com/karaggeorge/ink-multi-select
 * MIT License
 *
 * Adapted for browser compatibility with ink-web by removing Node.js dependencies.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Text, useInput } from 'ink-web/bundled'

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

// Simple array rotation helper
function rotateArray<T>(array: T[], count: number): T[] {
  const len = array.length
  if (len === 0) return array
  const normalizedCount = ((count % len) + len) % len
  return [...array.slice(normalizedCount), ...array.slice(0, normalizedCount)]
}

// Deep equality check for arrays of items
function areItemsEqual<V>(a: MultiSelectItem<V>[], b: MultiSelectItem<V>[]): boolean {
  if (a.length !== b.length) return false
  return a.every((item, index) => {
    const other = b[index]
    return item.value === other?.value && item.label === other?.label
  })
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
  limit: customLimit,
  indicatorComponent: IndicatorComponent = DefaultIndicator,
  checkboxComponent: CheckboxComponent = DefaultCheckbox,
  itemComponent: ItemComponent = DefaultItem,
  onSelect,
  onUnselect,
  onSubmit,
  onHighlight,
}: MultiSelectProps<V>) {
  const hasLimit = typeof customLimit === 'number' && items.length > customLimit
  const limit = hasLimit ? Math.min(customLimit, items.length) : items.length

  const [rotateIndex, setRotateIndex] = useState(0)
  const [highlightedIndex, setHighlightedIndex] = useState(
    initialIndex > limit - 1 ? limit - 1 : initialIndex
  )
  const [internalSelected, setInternalSelected] = useState<MultiSelectItem<V>[]>(defaultSelected)
  const previousItems = useRef<MultiSelectItem<V>[]>(items)

  const selected = controlledSelected ?? internalSelected

  const isSelected = useCallback((value: V) => {
    return selected.some(item => item.value === value)
  }, [selected])

  useEffect(() => {
    if (!areItemsEqual(previousItems.current, items)) {
      setRotateIndex(0)
      setHighlightedIndex(0)
    }
    previousItems.current = items
  }, [items])

  useInput(
    useCallback(
      (input, key) => {
        if (input === 'k' || key.upArrow) {
          const lastIdx = limit - 1
          const atFirstIndex = highlightedIndex === 0
          const nextIndex = hasLimit ? highlightedIndex : lastIdx
          const nextRotateIndex = atFirstIndex ? rotateIndex + 1 : rotateIndex
          const nextHighlightedIndex = atFirstIndex ? nextIndex : highlightedIndex - 1

          setRotateIndex(nextRotateIndex)
          setHighlightedIndex(nextHighlightedIndex)

          const slicedItems = hasLimit
            ? rotateArray(items, nextRotateIndex).slice(0, limit)
            : items

          if (typeof onHighlight === 'function' && slicedItems[nextHighlightedIndex]) {
            onHighlight(slicedItems[nextHighlightedIndex])
          }
        }

        if (input === 'j' || key.downArrow) {
          const atLastIndex = highlightedIndex === limit - 1
          const nextIndex = hasLimit ? highlightedIndex : 0
          const nextRotateIndex = atLastIndex ? rotateIndex - 1 : rotateIndex
          const nextHighlightedIndex = atLastIndex ? nextIndex : highlightedIndex + 1

          setRotateIndex(nextRotateIndex)
          setHighlightedIndex(nextHighlightedIndex)

          const slicedItems = hasLimit
            ? rotateArray(items, nextRotateIndex).slice(0, limit)
            : items

          if (typeof onHighlight === 'function' && slicedItems[nextHighlightedIndex]) {
            onHighlight(slicedItems[nextHighlightedIndex])
          }
        }

        if (input === ' ') {
          const slicedItems = hasLimit
            ? rotateArray(items, rotateIndex).slice(0, limit)
            : items
          const item = slicedItems[highlightedIndex]

          if (item) {
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
        }

        if (key.return) {
          onSubmit?.(selected)
        }
      },
      [hasLimit, limit, rotateIndex, highlightedIndex, items, selected, controlledSelected, isSelected, onSelect, onUnselect, onSubmit, onHighlight]
    ),
    { isActive: focus }
  )

  const slicedItems = hasLimit
    ? rotateArray(items, rotateIndex).slice(0, limit)
    : items

  return (
    <Box flexDirection="column">
      {slicedItems.map((item, index) => {
        const isHighlighted = index === highlightedIndex
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
