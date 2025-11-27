'use client'

import 'ink-web/css'
import 'xterm/css/xterm.css'
import { InkTerminalBox } from 'ink-web'
import { DemoApp } from './DemoApp'

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
