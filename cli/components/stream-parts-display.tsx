import { useEffect, useState } from 'react'
import { useInk } from '../src/context'

export const StreamPartsDisplay = ({ parts, isStreaming }: { parts: StreamPart[]; isStreaming?: boolean }) => {
  const { Box, Text } = useInk()
  const [frame, setFrame] = useState(0)
  const frames = ['⚡', '⚡', '⚡', ' ', ' ', ' ']

  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        setFrame((prev) => (prev + 1) % frames.length)
      }, 200)
      return () => clearInterval(interval)
    }
  }, [isStreaming])

  if (!parts || parts.length === 0) return null

  return (
    <Box flexDirection="column">
      {parts.map((part, index) => {
        if (part.type === 'tool') {
          return (
            <Box key={`tool-${part.toolName}-${index}`} marginBottom={0}>
              <Text color="yellow">
                {isStreaming && frame < 3 ? frames[frame] : '⚡'} {isStreaming ? 'Using' : 'Used'} tool: {part.toolName}
              </Text>
              {part.state === 'call' && isStreaming && <Text color="gray"> (calling...)</Text>}
              {part.state === 'result' && <Text color="green"> ✓</Text>}
              {part.state === 'error' && <Text color="red"> ✗ error</Text>}
            </Box>
          )
        } else if (part.type === 'text' && part.content) {
          return (
            <Box key={`text-${index}`} marginTop={index > 0 && parts[index - 1].type === 'tool' ? 1 : 0}>
              <Text>{part.content}</Text>
            </Box>
          )
        }
        return null
      })}
    </Box>
  )
}
