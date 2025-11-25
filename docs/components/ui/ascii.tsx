import { useState, useEffect } from 'react'
import { Text } from 'ink-web/bundled'
import figlet from 'figlet'

export interface AsciiProps {
  text: string
  font?: string
  horizontalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing'
  verticalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing'
  color?: string
}

export const Ascii = ({
  text,
  font = 'Standard',
  horizontalLayout = 'default',
  verticalLayout = 'default',
  color,
}: AsciiProps) => {
  const [asciiArt, setAsciiArt] = useState('')

  useEffect(() => {
    figlet.text(text, {
      font: font as any,
      horizontalLayout,
      verticalLayout,
    }, (err, result) => {
      if (err) {
        console.error('Figlet error:', err)
        return
      }
      if (result) {
        setAsciiArt(result)
      }
    })
  }, [text, font, horizontalLayout, verticalLayout])

  return <Text color={color}>{asciiArt}</Text>
}

export default Ascii
