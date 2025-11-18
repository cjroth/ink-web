import { InkXterm, Text } from '@ink-web/browser/bundled'

export function InkDemo() {
  return (
    <InkXterm focus>
      <Text color="green">Hello World from Ink!</Text>
      <Text> </Text>
      <Text dimColor>Running in the browser with xterm.js</Text>
    </InkXterm>
  )
}

