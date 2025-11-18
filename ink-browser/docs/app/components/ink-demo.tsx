import { DemoApp, InkXterm } from '@ink-web/browser/bundled'
import 'xterm/css/xterm.css'
import './ink-demo.css'

export function InkDemo() {
  return (
    <div className="w-full h-64 border border-fd-border rounded overflow-hidden">
      <div className="ink-terminal-reset">
        <InkXterm focus>
          <DemoApp />
        </InkXterm>
      </div>
    </div>
  )
}
