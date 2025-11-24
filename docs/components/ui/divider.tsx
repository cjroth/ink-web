import { Text, Box } from 'ink-web/bundled'

export interface DividerProps {
  title?: string
  /**
   * Width in columns. Defaults to process.stdout.columns or 80.
   */
  columns?: number
  padding?: number
  titlePadding?: number
  titleColor?: string
  dividerChar?: string
  dividerColor?: string
}

export const Divider = ({
  title,
  columns,
  padding = 0,
  titlePadding = 1,
  titleColor = 'white',
  dividerChar = '─',
  dividerColor = 'gray',
}: DividerProps) => {
  const terminalWidth = columns || (typeof process !== 'undefined' && process.stdout?.columns) || 80
  const availableWidth = terminalWidth - (padding * 2)

  if (!title) {
    const line = dividerChar.repeat(availableWidth)
    return (
      <Box paddingLeft={padding} paddingRight={padding}>
        <Text color={dividerColor}>{line}</Text>
      </Box>
    )
  }

  const titleText = ' '.repeat(titlePadding) + title + ' '.repeat(titlePadding)
  const remainingWidth = availableWidth - titleText.length
  const sideWidth = Math.floor(remainingWidth / 2)
  const leftLine = dividerChar.repeat(Math.max(0, sideWidth))
  const rightLine = dividerChar.repeat(Math.max(0, remainingWidth - sideWidth))

  return (
    <Box paddingLeft={padding} paddingRight={padding}>
      <Text color={dividerColor}>{leftLine}</Text>
      <Text color={titleColor}>{titleText}</Text>
      <Text color={dividerColor}>{rightLine}</Text>
    </Box>
  )
}

export default Divider
