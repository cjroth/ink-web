import React, { useEffect, useRef } from 'react'
import type { ITerminalOptions } from 'xterm'
import { mountInkInXterm } from './xterm-ink'

interface InkXtermProps {
  className?: string
  focus?: boolean
  termOptions?: ITerminalOptions
  children: React.ReactElement
}

export const InkXterm: React.FC<InkXtermProps> = ({ className = '', focus, termOptions, children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const { unmount } = mountInkInXterm(children, { container: containerRef.current, focus, termOptions })
    return () => {
      void unmount()
    }
  }, [children, focus, termOptions])

  return <div className={className} ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default InkXterm
