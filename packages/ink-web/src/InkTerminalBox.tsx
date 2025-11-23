import React from 'react'
import type { ITerminalOptions } from 'xterm'
import './InkTerminalBox.css'
import { InkXterm } from './InkXterm'

export interface InkTerminalBoxProps {
  className?: string
  focus?: boolean
  termOptions?: ITerminalOptions
  children: React.ReactElement
}

/**
 * A wrapper component that provides proper styling and containment for InkXterm.
 * Handles CSS isolation from parent styles and ensures proper scrolling behavior.
 */
export const InkTerminalBox: React.FC<InkTerminalBoxProps> = ({ className = '', focus, termOptions, children }) => {
  return (
    <div className={`ink-terminal-box ${className}`}>
      <div className="ink-terminal-reset">
        <InkXterm focus={focus} termOptions={termOptions}>
          {children}
        </InkXterm>
      </div>
    </div>
  )
}

export default InkTerminalBox
