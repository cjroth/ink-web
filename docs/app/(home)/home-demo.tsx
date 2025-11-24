'use client'

import { createDynamicTerminal } from 'ink-web/next'

const InkDemo = createDynamicTerminal(
  () => import('../components/InkDemo').then((mod) => mod.InkDemo),
  {
    loading: {
      position: 'top-left',
      type: 'skeleton'
    },
    rows: 15
  }
)

export function HomeDemo() {
  return <InkDemo />
}
