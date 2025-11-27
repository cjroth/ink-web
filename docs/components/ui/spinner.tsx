import { useEffect, useState } from 'react'
import { Text } from 'ink'

export interface SpinnerProps {
  text?: string
  color?: string
  interval?: number
}

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

export const Spinner = ({ text = 'Loading', color = 'gray', interval = 100 }: SpinnerProps) => {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length)
    }, interval)

    return () => clearInterval(timer)
  }, [interval])

  return <Text color={color}>{frames[frame]} {text}</Text>
}

export default Spinner
