import { Text } from 'ink'
import figlet from 'figlet'

export interface AsciiProps {
  /**
   * The text to render as ASCII art
   */
  text: string
  /**
   * The figlet font to use
   * @default 'Standard'
   */
  font?: string
  /**
   * Horizontal layout mode
   * @default 'default'
   */
  horizontalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing'
  /**
   * Vertical layout mode
   * @default 'default'
   */
  verticalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing'
  /**
   * Color of the ASCII art text
   */
  color?: string
}

/**
 * Ascii component for Ink
 *
 * Renders text as ASCII art using figlet fonts.
 *
 * Based on ink-ascii by Xiaoru Li (https://github.com/hexrcs/ink-ascii)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Ascii text="Hello" />
 *
 * // With custom font
 * <Ascii text="World" font="Big" />
 *
 * // With color
 * <Ascii text="Cool" font="Standard" color="cyan" />
 * ```
 */
export const Ascii = ({
  text,
  font = 'Standard',
  horizontalLayout = 'default',
  verticalLayout = 'default',
  color,
}: AsciiProps) => {
  const asciiArt = figlet.textSync(text, {
    font: font as figlet.Fonts,
    horizontalLayout,
    verticalLayout,
  })

  return <Text color={color}>{asciiArt}</Text>
}

export default Ascii
