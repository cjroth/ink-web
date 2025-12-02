import React, { useState, useCallback } from 'react'
import type { ITerminalOptions } from 'ghostty-web'
import './InkTerminalBox.css'
import { InkTerminal } from './InkTerminal'
import { getTerminalHeight } from './utils'
import { InkTerminalLoadingPlaceholder } from './InkTerminalLoadingPlaceholder'
import type { LoadingOption } from './InkTerminalLoadingPlaceholder'

export interface InkTerminalBoxProps {
  className?: string
  focus?: boolean
  termOptions?: ITerminalOptions
  children: React.ReactElement
  /** Number of rows to display. Determines terminal height. */
  rows?: number
  /** Callback when terminal is ready and rendered */
  onReady?: () => void
  /** Loading indicator to show while terminal initializes. Defaults to skeleton loader. Set to false to disable. */
  loading?: LoadingOption | false
  /** Padding around the terminal content in pixels. Defaults to 10. */
  padding?: number
}

// Re-export for convenience
export { getTerminalHeight }

/**
 * A wrapper component that provides proper styling and containment for InkTerminal.
 * Handles CSS isolation from parent styles and ensures proper scrolling behavior.
 */
export const InkTerminalBox: React.FC<InkTerminalBoxProps> = ({ className = '', focus, termOptions, children, rows = 15, onReady, loading, padding = 10 }) => {
  // Default to skeleton loading unless explicitly disabled
  const showLoading = loading !== false
  const [ready, setReady] = useState(!showLoading)

  const handleReady = useCallback(() => {
    setReady(true)
    onReady?.()
  }, [onReady])

  // Calculate height from rows if specified
  const height = rows ? getTerminalHeight(rows) : undefined
  const mergedTermOptions = rows ? { ...termOptions, rows } : termOptions

  return (
    <div
      className={`ink-terminal-box ${className}`}
      style={height ? { height: `${height}px`, position: 'relative', padding: `${padding}px` } : { position: 'relative', padding: `${padding}px` }}
    >
      {showLoading && !ready && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}>
          <InkTerminalLoadingPlaceholder rows={rows} loading={loading || undefined} className={className} />
        </div>
      )}
      <div
        className="ink-terminal-reset"
        style={showLoading ? { visibility: ready ? 'visible' : 'hidden', top: `${padding}px`, left: `${padding}px`, right: `${padding}px`, bottom: `${padding}px` } : { top: `${padding}px`, left: `${padding}px`, right: `${padding}px`, bottom: `${padding}px` }}
      >
        <InkTerminal focus={focus} termOptions={mergedTermOptions} onReady={handleReady}>
          {children}
        </InkTerminal>
      </div>
    </div>
  )
}

export default InkTerminalBox
