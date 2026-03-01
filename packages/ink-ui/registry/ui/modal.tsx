import type { ReactNode } from 'react'
import { Box, Text, useInput } from 'ink'

export interface ModalProps {
  children: ReactNode
  title?: string
  borderColor?: string
  borderStyle?: 'single' | 'double' | 'round' | 'bold' | 'singleDouble' | 'doubleSingle' | 'classic' | 'arrow'
  onClose?: () => void
}

export function Modal({
  children,
  title,
  borderColor = 'blue',
  borderStyle = 'round',
  onClose,
}: ModalProps) {
  useInput((_input, key) => {
    if (key.escape && onClose) {
      onClose()
    }
  })

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Box
        flexDirection="column"
        flexGrow={1}
        borderStyle={borderStyle}
        borderColor={borderColor}
      >
        {title && (
          <Box paddingX={1} marginBottom={1}>
            <Text bold color={borderColor}>{title}</Text>
          </Box>
        )}
        {children}
      </Box>
    </Box>
  )
}

export default Modal
