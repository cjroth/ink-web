import { InkTerminalBox } from '@ink-web/browser/bundled'
import '@ink-web/browser/bundled/css'
import 'xterm/css/xterm.css'
import { DemoApp } from './DemoApp'

export function InkDemo() {
  return (
    <InkTerminalBox focus>
      <DemoApp />
    </InkTerminalBox>
  )
}
