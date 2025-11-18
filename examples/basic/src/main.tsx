import { InkXterm } from 'ink-web'
import { Box, Text, useInput } from 'ink'
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import 'xterm/css/xterm.css'

const App = () => {
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
      <Text color="green">Hello from Ink in the browser!</Text>
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

const root = createRoot(document.getElementById('terminal')!)
root.render(
  <InkXterm focus>
    <App />
  </InkXterm>
)
