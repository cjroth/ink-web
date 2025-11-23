import { useState, useCallback } from 'react'
import { Box, Text, useInput } from 'ink'

export interface UseTextInputOptions {
  onSubmit?: (value: string) => void
}

export interface UseTextInputReturn {
  value: string
  setValue: (value: string) => void
  history: string[]
  clear: () => void
  clearHistory: () => void
}

export function useTextInput(options: UseTextInputOptions = {}): UseTextInputReturn {
  const [value, setValueInternal] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const setValue = useCallback((newValue: string) => {
    setValueInternal(newValue)
  }, [])

  const clear = useCallback(() => {
    setValueInternal('')
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  useInput((inputChar, key) => {
    if (key.return) {
      if (value.trim()) {
        setHistory((prev) => [...prev, value])
        options.onSubmit?.(value)
        setValueInternal('')
      }
    } else if (key.backspace || key.delete) {
      setValueInternal((prev) => prev.slice(0, -1))
    } else if (!key.ctrl && !key.meta && inputChar) {
      setValueInternal((prev) => prev + inputChar)
    }
  })

  return { value, setValue, history, clear, clearHistory }
}

export interface TextInputProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  prompt?: string
  promptColor?: string
  cursorColor?: string
  focus?: boolean
}

export const TextInput = ({
  value: controlledValue,
  onChange,
  onSubmit,
  placeholder = '',
  prompt = '> ',
  promptColor = 'cyan',
  cursorColor,
  focus = true,
}: TextInputProps) => {
  const [internalValue, setInternalValue] = useState('')

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = useCallback((newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }, [controlledValue, onChange])

  useInput((inputChar, key) => {
    if (!focus) return

    if (key.return) {
      if (value.trim()) {
        onSubmit?.(value)
        if (controlledValue === undefined) {
          setInternalValue('')
        }
      }
    } else if (key.backspace || key.delete) {
      setValue(value.slice(0, -1))
    } else if (!key.ctrl && !key.meta && inputChar) {
      setValue(value + inputChar)
    }
  })

  const showPlaceholder = !value && placeholder

  return (
    <Box>
      <Text color={promptColor}>{prompt}</Text>
      {showPlaceholder ? (
        <Text dimColor>{placeholder}</Text>
      ) : (
        <Text>{value}</Text>
      )}
      {focus && <Text inverse color={cursorColor}> </Text>}
    </Box>
  )
}

export default TextInput
