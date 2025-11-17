import type React from 'react'
import { useEffect, useState } from 'react'

export default function ClientOnlyInkDemo() {
  const [isClient, setIsClient] = useState(false)
  const [Component, setComponent] = useState<React.ComponentType<{ children: React.ReactNode }> | null>(null)

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return

    setIsClient(true)
    // Dynamic import only on client side
    Promise.all([import('@/ink-browser/src/InkXterm'), import('ink')])
      .then(([inkXtermModule, inkModule]) => {
        const InkXtermComponent = inkXtermModule.InkXterm || inkXtermModule.default
        const TextComponent = inkModule.Text

        // Create a wrapper component
        const Wrapper = ({ children }: { children: React.ReactNode }) => (
          <InkXtermComponent>
            <TextComponent>{children}</TextComponent>
          </InkXtermComponent>
        )

        setComponent(() => Wrapper)
      })
      .catch((err) => {
        console.error('Failed to load Ink components:', err)
      })
  }, [])

  if (!isClient || !Component) {
    return <div className="h-32 w-full bg-gray-100 rounded animate-pulse" />
  }

  return <Component>Hello, world!</Component>
}
