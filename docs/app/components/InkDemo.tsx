'use client'

import 'ink-web/bundled/css'
import 'xterm/css/xterm.css'
import { InkTerminalBox, DemoApp } from 'ink-web/bundled'

export function InkDemo({ onReady }: { onReady?: () => void }) {
  return (
    <InkTerminalBox
      rows={15}
      focus
      termOptions={{ fontFamily: 'Monaspace Neon, monospace' }}
      onReady={onReady}
      loading={{ type: 'skeleton', position: 'top-left' }}
    >
      <DemoApp />
    </InkTerminalBox>
  )
}
