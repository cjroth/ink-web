import React, { useEffect, useRef } from 'react'
import { mountInkInXterm } from '../src'

export default {
  title: 'Ink/Browser',
}

export const Basic = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!ref.current) return
    const App = () => React.createElement('div', null, 'Ink + Ghostty')
    const { unmount } = mountInkInXterm(React.createElement(App), { container: ref.current })
    return () => {
      void unmount()
    }
  }, [])
  return <div ref={ref} style={{ width: '600px', height: '300px' }} />
}
