'use client'

import 'ink-web/bundled/css'
import dynamic from 'next/dynamic'
import React, { useEffect, useState, type ReactNode } from 'react'
import 'xterm/css/xterm.css'

type InkModule = typeof import('ink-web/bundled')

export interface InkWebDynamicProps {
  children: ReactNode | ((ink: InkModule) => ReactNode)
  focus?: boolean
  termOptions?: {
    fontFamily?: string
    fontSize?: number
    [key: string]: any
  }
}

function InkWebDynamicInner({ children, focus = true, termOptions }: InkWebDynamicProps) {
  const [inkModule, setInkModule] = useState<InkModule | null>(null)

  useEffect(() => {
    import('ink-web/bundled').then((mod) => {
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
