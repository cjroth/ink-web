'use client'

import dynamic from 'next/dynamic'
import { getTerminalHeight } from 'ink-web/utils'

// Must match the rows prop in InkDemo.tsx
const ROWS = 15
const HEIGHT = getTerminalHeight(ROWS)

const InkDemo = dynamic(() => import('../components/InkDemo').then((mod) => ({ default: mod.InkDemo })), {
  ssr: false,
  loading: () => <div style={{ height: HEIGHT, background: '#1a1a1a' }} />,
})

export function HomeDemo() {
  return <InkDemo />
}
