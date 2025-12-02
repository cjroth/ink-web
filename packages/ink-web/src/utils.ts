// Pure utility functions that are safe for SSR

// Re-export loading placeholder for SSR-safe usage
export { InkTerminalLoadingPlaceholder } from './InkTerminalLoadingPlaceholder'
export type { InkTerminalLoadingPlaceholderProps, LoadingOption, LoadingType, LoadingPosition, LoadingConfig } from './InkTerminalLoadingPlaceholder'

// Default line height in pixels (fontSize 15 * lineHeight ~1.2)
export const TERMINAL_LINE_HEIGHT = 18
// Padding inside terminal (top + bottom)
export const TERMINAL_PADDING = 20
// Default background color (using #010101 because ghostty-web treats #000000 as "use default")
export const TERMINAL_BACKGROUND = '#010101'
// Default number of rows
export const DEFAULT_ROWS = 15

/**
 * Calculate pixel height from number of rows
 */
export function getTerminalHeight(rows: number): number {
  return rows * TERMINAL_LINE_HEIGHT + TERMINAL_PADDING
}

/**
 * Get loading placeholder style for a terminal
 */
export function getTerminalPlaceholderStyle(rows: number = DEFAULT_ROWS): { height: number; background: string } {
  return {
    height: getTerminalHeight(rows),
    background: TERMINAL_BACKGROUND,
  }
}

/**
 * Get loading placeholder style with centered content
 */
export function getTerminalPlaceholderStyleCentered(rows: number = DEFAULT_ROWS): React.CSSProperties {
  return {
    height: getTerminalHeight(rows),
    background: TERMINAL_BACKGROUND,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}
