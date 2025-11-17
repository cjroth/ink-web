import { useEffect, useState } from 'react'
import { useInk } from '../src/context'

export const LoadingIndicator = () => {
  const { Text } = useInk()
  const [frame, setFrame] = useState(0)
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return <Text color="gray">{frames[frame]} Thinking</Text>
}
