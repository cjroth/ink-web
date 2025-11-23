'use client'

// CSS imports - these are loaded at runtime, externalized during build
import 'ink-web/bundled/css'
import 'xterm/css/xterm.css'

import dynamic from 'next/dynamic'
import React, { useEffect, useState, type ReactNode } from 'react'

// Import types from local source to avoid circular dependency during parallel DTS builds
import type { InkTerminalBox as InkTerminalBoxType, InkTerminalBoxProps } from './InkTerminalBox'

// Define what we need from the bundled module
interface InkModule {
  InkTerminalBox: typeof InkTerminalBoxType
  [key: string]: any
}

export interface InkWebDynamicProps {
  children: ReactNode | ((ink: InkModule) => ReactNode)
  focus?: boolean
  termOptions?: InkTerminalBoxProps['termOptions']
}

function InkWebDynamicInner({ children, focus = true, termOptions }: InkWebDynamicProps) {
  const [inkModule, setInkModule] = useState<InkModule | null>(null)

  useEffect(() => {
    // Dynamic import from package path - kept external by tsup
    // @ts-ignore - module types may not be available during parallel DTS builds
    import('ink-web/bundled').then((mod: InkModule) => {
      setInkModule(mod)
    })
  }, [])

  if (!inkModule) {
    return <div className="w-full h-96 bg-muted animate-pulse rounded-lg" />
  }

  const { InkTerminalBox } = inkModule
  const content = typeof children === 'function' ? children(inkModule) : children

  return (
    <InkTerminalBox focus={focus} termOptions={termOptions}>
      {content as React.ReactElement}
    </InkTerminalBox>
  )
}

export const InkWebDynamic = dynamic(
  () => Promise.resolve(InkWebDynamicInner),
  {
    ssr: false,
    loading: () => <div className="w-full h-96 bg-muted animate-pulse rounded-lg" />,
  }
) as React.ComponentType<InkWebDynamicProps>
