'use client'

import 'ink-web/bundled/css'
import 'xterm/css/xterm.css'
import { InkTerminalBox, DemoApp } from 'ink-web/bundled'
import { Loader2 } from 'lucide-react'

export function InkDemo() {
  return (
    <InkTerminalBox
      rows={15}
      focus
      termOptions={{ fontFamily: 'Monaspace Neon, monospace' }}
      loading={<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
    >
      <DemoApp />
    </InkTerminalBox>
  )
}
