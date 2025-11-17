import type { BoxProps, Key, TextProps } from 'ink-web'
import type { ComponentType, PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

interface InkContextValue {
  Box: ComponentType<PropsWithChildren<BoxProps>>
  Text: ComponentType<PropsWithChildren<TextProps>>
  useApp: () => { exit: (error?: Error) => void }
  useInput: (inputHandler: (input: string, key: Key) => void, options?: { isActive?: boolean }) => void
  TextInput: ComponentType<{
    value: string
    onChange: (value: string) => void
    onSubmit?: (value: string) => void
    placeholder?: string
  }>
}

const InkContext = createContext<InkContextValue | null>(null)

export const useInk = () => {
  const context = useContext(InkContext)
  if (!context) {
    throw new Error('useInk must be used within a CliProvider')
  }
  return context
}

export { InkContext }
export type { InkContextValue }
