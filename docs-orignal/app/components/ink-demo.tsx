import { InkTerminalBox } from 'ink-web/bundled'
import 'ink-web/bundled/css'
import 'xterm/css/xterm.css'
import { DemoApp } from './DemoApp'

export function InkDemo() {
  return (
    <InkTerminalBox focus>
      <DemoApp />
    </InkTerminalBox>
  )
}
