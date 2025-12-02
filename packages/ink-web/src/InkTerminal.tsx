import React, { useEffect, useRef } from 'react'
import type { ITerminalOptions } from 'ghostty-web'
import { mountInk } from './ghostty-ink'

interface InkTerminalProps {
  className?: string
  focus?: boolean
  termOptions?: ITerminalOptions
  children: React.ReactElement
  onReady?: () => void
}

export const InkTerminal: React.FC<InkTerminalProps> = ({ className = '', focus, termOptions, children, onReady }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const unmountRef = useRef<(() => Promise<void>) | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const initialize = () => {
      if (initializedRef.current || !container) return

      // Check if container has dimensions
      if (container.clientWidth === 0 || container.clientHeight === 0) return

      initializedRef.current = true
      const { unmount } = mountInk(children, { container, focus, termOptions, onReady })
      unmountRef.current = unmount
    }

    // Use requestAnimationFrame to ensure we're past the paint cycle
    // This ensures the container is fully in the DOM and has dimensions
    const rafId = requestAnimationFrame(() => {
      initialize()

      // If still not initialized (no dimensions yet), observe for changes
      if (!initializedRef.current) {
        ro = new ResizeObserver(() => {
          initialize()
          if (initializedRef.current && ro) {
            ro.disconnect()
          }
        })
        ro.observe(container)
      }
    })

    let ro: ResizeObserver | null = null

    return () => {
      cancelAnimationFrame(rafId)
      ro?.disconnect()
      initializedRef.current = false
      if (unmountRef.current) {
        void unmountRef.current()
        unmountRef.current = null
      }
    }
  }, [children, focus, termOptions, onReady])

  return <div className={className} ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default InkTerminal
