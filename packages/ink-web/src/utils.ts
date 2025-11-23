// Pure utility functions that are safe for SSR

// Default line height in pixels (fontSize 15 * lineHeight ~1.2)
export const TERMINAL_LINE_HEIGHT = 18
// Padding inside terminal (top + bottom)
export const TERMINAL_PADDING = 20

/**
 * Calculate pixel height from number of rows
 */
export function getTerminalHeight(rows: number): number {
  return rows * TERMINAL_LINE_HEIGHT + TERMINAL_PADDING
}
