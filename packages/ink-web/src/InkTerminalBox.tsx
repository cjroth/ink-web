import React, { useState, useCallback } from 'react'
import type { ITerminalOptions } from 'xterm'
import './InkTerminalBox.css'
import { InkXterm } from './InkXterm'
import { getTerminalHeight } from './utils'

export interface InkTerminalBoxProps {
  className?: string
  focus?: boolean
  termOptions?: ITerminalOptions
  children: React.ReactElement
  /** Number of rows to display. Determines terminal height. */
  rows?: number
  /** Callback when terminal is ready and rendered */
  onReady?: () => void
  /** Loading indicator to show while terminal initializes. If provided, terminal will be hidden until ready. */
  loading?: React.ReactNode
}

// Re-export for convenience
export { getTerminalHeight }

/**
 * A wrapper component that provides proper styling and containment for InkXterm.
 * Handles CSS isolation from parent styles and ensures proper scrolling behavior.
 */
export const InkTerminalBox: React.FC<InkTerminalBoxProps> = ({ className = '', focus, termOptions, children, rows, onReady, loading }) => {
  const [ready, setReady] = useState(!loading)

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
      style={height ? { height: `${height}px`, position: 'relative' } : { position: 'relative' }}
    >
      {loading && !ready && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          background: '#1a1a1a'
        }}>
          {loading}
        </div>
      )}
      <div
        className="ink-terminal-reset"
        style={loading ? { visibility: ready ? 'visible' : 'hidden' } : undefined}
      >
        <InkXterm focus={focus} termOptions={mergedTermOptions} onReady={handleReady}>
          {children}
        </InkXterm>
      </div>
    </div>
  )
}

export default InkTerminalBox
