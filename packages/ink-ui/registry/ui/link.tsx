import type { ReactNode } from 'react'
import { Transform, Text } from 'ink'

export interface LinkProps {
  /**
   * The content to display as the link text
   */
  children: ReactNode
  /**
   * The URL to link to
   */
  url: string
}

/**
 * Link component for Ink
 *
 * Creates clickable links in the terminal. Uses OSC 8 escape sequences
 * which are supported by many modern terminal emulators.
 *
 * Based on ink-link by Sindre Sorhus (https://github.com/sindresorhus/ink-link)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Link url="https://github.com">GitHub</Link>
 *
 * // Inline with text
 * <Box>
 *   <Text>Check out </Text>
 *   <Link url="https://github.com">GitHub</Link>
 * </Box>
 * ```
 */
export const Link = ({ children, url }: LinkProps) => (
  <Transform transform={text => `\x1b]8;;${url}\x07${text}\x1b]8;;\x07`}>
    <Text>{children}</Text>
  </Transform>
)

export default Link
