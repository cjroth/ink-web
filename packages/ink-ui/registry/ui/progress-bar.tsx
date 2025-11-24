import { Text } from 'ink'
import type { TextProps } from 'ink'

export interface ProgressBarProps extends Omit<TextProps, 'children'> {
  /**
   * The percentage of progress (between 0 and 1)
   * @default 0
   */
  percent?: number
  /**
   * Number of characters to subtract from the left side
   * Useful when displaying text before the progress bar
   * @default 0
   */
  left?: number
  /**
   * Number of characters to subtract from the right side
   * Useful when displaying text after the progress bar
   * @default 0
   */
  right?: number
  /**
   * Override the terminal width in columns
   * If not provided, uses process.stdout.columns or 80
   * @default process.stdout.columns || 80
   */
  columns?: number
  /**
   * The character to use for each step of the progress bar
   * @default '█'
   */
  character?: string
  /**
   * Whether to pad the right side of the progress bar with spaces
   * When true, the bar will always take up the full available width
   * @default false
   */
  rightPad?: boolean
}

/**
 * ProgressBar component for Ink
 *
 * A flexible progress bar component that adapts to terminal width and supports
 * customization of appearance and spacing.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ProgressBar percent={0.5} />
 *
 * // With colored progress
 * <ProgressBar percent={0.75} color="green" />
 *
 * // With text on the same line
 * <Box>
 *   <Text>Loading: </Text>
 *   <ProgressBar percent={progress} left={10} right={5} />
 *   <Text> {Math.round(progress * 100)}%</Text>
 * </Box>
 *
 * // Custom character and styling
 * <ProgressBar
 *   percent={0.8}
 *   character="▓"
 *   color="cyan"
 *   rightPad
 * />
 * ```
 */
export const ProgressBar = ({
  percent = 0,
  left = 0,
  right = 0,
  columns,
  character = '█',
  rightPad = false,
  ...textProps
}: ProgressBarProps) => {
  // Calculate available terminal width
  const screen = columns || (typeof process !== 'undefined' && process.stdout?.columns) || 80

  // Calculate space available for the progress bar
  const space = Math.max(0, screen - right - left)

  // Calculate how many characters to fill based on percent (clamped between 0 and 1)
  const clampedPercent = Math.max(0, Math.min(1, percent))
  const filled = Math.min(Math.floor(space * clampedPercent), space)

  // Generate the progress bar string
  const chars = character.repeat(filled)

  // Add right padding if requested
  const bar = rightPad ? chars + ' '.repeat(space - filled) : chars

  return <Text {...textProps}>{bar}</Text>
}

export default ProgressBar
