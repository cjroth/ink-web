'use client'

import React, { useState, ComponentType } from 'react'
import dynamic from 'next/dynamic'
import { InkTerminalLoadingPlaceholder } from './InkTerminalLoadingPlaceholder'
import type { LoadingOption } from './InkTerminalLoadingPlaceholder'

export interface InkTerminalBoxDynamicOptions {
  /** Number of rows for the terminal. Used for skeleton height. */
  rows?: number
  /** Loading indicator: 'spinner' | 'skeleton' | 'progress' | { type, position } | ReactNode */
  loading?: LoadingOption
  /** Additional className for the skeleton */
  className?: string
}

/**
 * Creates a dynamically loaded terminal component with SSR-safe skeleton.
 * The skeleton persists through hydration to prevent animation resets.
 *
 * @example
 * ```tsx
 * // MyTerminal.tsx
 * export function MyTerminal({ onReady }: { onReady?: () => void }) {
 *   return (
 *     <InkTerminalBox rows={15} onReady={onReady}>
 *       <MyApp />
 *     </InkTerminalBox>
 *   )
 * }
 *
 * // page.tsx
 * import { createDynamicTerminal } from 'ink-web'
 *
 * const Terminal = createDynamicTerminal(
 *   () => import('./MyTerminal').then(m => m.MyTerminal),
 *   { rows: 15 }
 * )
 *
 * export default function Page() {
 *   return <Terminal />
 * }
 * ```
 */
export function createDynamicTerminal<P extends { onReady?: () => void }>(
  importFn: () => Promise<ComponentType<P>>,
  options: InkTerminalBoxDynamicOptions = {}
): React.FC<Omit<P, 'onReady'>> {
  const DynamicComponent = dynamic(importFn, { ssr: false })

  return function DynamicTerminal(props: Omit<P, 'onReady'>) {
    const [ready, setReady] = useState(false)

    return (
      <div style={{ position: 'relative' }}>
        {!ready && (
          <InkTerminalLoadingPlaceholder
            rows={options.rows}
            loading={options.loading}
            className={options.className}
          />
        )}
        <div style={{
          visibility: ready ? 'visible' : 'hidden',
          position: ready ? 'relative' : 'absolute',
          top: 0,
          left: 0,
          right: 0
        }}>
          <DynamicComponent {...(props as P)} onReady={() => setReady(true)} />
        </div>
      </div>
    )
  }
}

export default createDynamicTerminal
