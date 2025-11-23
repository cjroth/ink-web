import React, { useEffect, useRef } from 'react'
import type { ITerminalOptions } from 'xterm'
import { mountInkInXterm } from './xterm-ink'

interface InkXtermProps {
  className?: string
  focus?: boolean
  termOptions?: ITerminalOptions
  children: React.ReactElement
  onReady?: () => void
}

export const InkXterm: React.FC<InkXtermProps> = ({ className = '', focus, termOptions, children, onReady }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Ensure container is fully mounted before initializing xterm
    // This prevents the "Cannot read properties of undefined (reading 'dimensions')" error
    const initTimeout = setTimeout(() => {
      if (!containerRef.current) return

      const { unmount } = mountInkInXterm(children, { container: containerRef.current, focus, termOptions, onReady })

      // Store unmount for cleanup
      ;(containerRef.current as any)._unmount = unmount
    }, 100)

    return () => {
      clearTimeout(initTimeout)
      const unmount = (containerRef.current as any)?._unmount
      if (unmount) {
        void unmount()
      }
    }
  }, [children, focus, termOptions, onReady])

  return <div className={className} ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default InkXterm
