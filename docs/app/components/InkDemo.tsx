'use client'

import 'ink-web/bundled/css'
import { useEffect, useState } from 'react'
import 'xterm/css/xterm.css'

export function InkDemo() {
  const [Component, setComponent] = useState<any>(null)

  useEffect(() => {
    // Ensure this only runs on the client
    import('ink-web/bundled').then((mod) => {
      const { InkTerminalBox, DemoApp } = mod
      const DemoComp = () => (
        <InkTerminalBox focus termOptions={{ fontFamily: 'Monaspace Neon, monospace' }}>
          <DemoApp />
        </InkTerminalBox>
      )
      setComponent(() => DemoComp)
    })
  }, [])

  if (!Component) {
    return <div className="w-full h-96 bg-muted animate-pulse rounded-lg" />
  }

  return <Component />
}
