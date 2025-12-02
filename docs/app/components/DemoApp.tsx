'use client'

import { Box, Text, useInput } from 'ink'
import { useState } from 'react'

export const DemoApp = () => {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])

  useInput((inputChar, key) => {
    if (key.return) {
      if (input.trim()) {
        setHistory((prev) => [...prev, input])
        setInput('')
      }
    } else if (key.backspace || key.delete) {
      setInput((prev) => prev.slice(0, -1))
    } else if (!key.ctrl && !key.meta && inputChar) {
      setInput((prev) => prev + inputChar)
    }
  })

  return (
    <Box flexDirection="column">
      <Text color="green">Ink + ghostty-web (browser)</Text>
      <Text dimColor>Type something and press Enter...</Text>
      <Text> </Text>
      {history.length > 0 && (
        <Box flexDirection="column">
          <Text bold>History:</Text>
          {history.map((item, i) => (
            <Text key={i}> {item}</Text>
          ))}
          <Text> </Text>
        </Box>
      )}
      <Text>
        <Text color="cyan">&gt; </Text>
        <Text>{input}</Text>
        <Text inverse> </Text>
      </Text>
    </Box>
  )
}
