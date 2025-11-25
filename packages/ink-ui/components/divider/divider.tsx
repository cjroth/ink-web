import { Text, Box } from 'ink-web/bundled'

export interface DividerProps {
  /**
   * Title shown in the middle of the divider
   */
  title?: string
  /**
   * Width of the divider
   * @default 'auto'
   */
  width?: 'auto' | number
  /**
   * Padding at the start and end of the divider
   * @default 0
   */
  padding?: number
  /**
   * Padding beside the title
   * @default 1
   */
  titlePadding?: number
  /**
   * Color of the title
   * @default 'white'
   */
  titleColor?: string
  /**
   * Character used as the divider
   * @default '─'
   */
  dividerChar?: string
  /**
   * Color of the divider
   * @default 'gray'
   */
  dividerColor?: string
}

const BaseDivider = ({
  dividerChar = '─',
  dividerColor = 'gray',
}: {
  dividerChar?: string
  dividerColor?: string
}) => (
  <Box
    // @ts-expect-error - custom border style for divider character
    borderStyle={{ bottom: dividerChar }}
    borderColor={dividerColor}
    flexGrow={1}
    borderBottom={true}
    borderTop={false}
    borderLeft={false}
    borderRight={false}
  />
)

/**
 * Divider component for ink-web
 *
 * A horizontal divider with optional centered title text.
 *
 * @example
 * ```tsx
 * // Simple divider
 * <Divider />
 *
 * // With title
 * <Divider title="Section" />
 *
 * // Custom styling
 * <Divider
 *   title="Options"
 *   titleColor="cyan"
 *   dividerColor="blue"
 *   dividerChar="="
 * />
 * ```
 */
export const Divider = ({
  title,
  width = 'auto',
  padding = 0,
  titlePadding = 1,
  titleColor = 'white',
  dividerChar = '─',
  dividerColor = 'gray',
}: DividerProps) => {
  const dividerLine = (
    <BaseDivider
      dividerChar={dividerChar}
      dividerColor={dividerColor}
    />
  )

  if (!title) {
    return (
      <Box paddingLeft={padding} paddingRight={padding}>
        {dividerLine}
      </Box>
    )
  }

  return (
    <Box
      width={width}
      paddingLeft={padding}
      paddingRight={padding}
      gap={titlePadding}
    >
      {dividerLine}
      <Box>
        <Text color={titleColor}>{title}</Text>
      </Box>
      {dividerLine}
    </Box>
  )
}

export default Divider
