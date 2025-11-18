import { baseOptions } from '@/lib/layout.shared'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <HomeLayout {...baseOptions()}>
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-xl font-bold mb-2">Fumadocs on React Router.</h1>
        <p className="text-fd-muted-foreground mb-4">The truly flexible docs framework on React.js.</p>
        
        <div className="w-full max-w-2xl mb-4">
          {mounted && <ClientOnlyInkDemo />}
        </div>

        <Link className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5" to="/docs">
          Open Docs
        </Link>
      </div>
    </HomeLayout>
  )
}

function ClientOnlyInkDemo() {
  const [Component, setComponent] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Lazy load the component to avoid SSR issues
    import('../components/ink-demo')
      .then((mod) => {
        console.log('Loaded module:', mod)
        setComponent(() => mod.InkDemo)
      })
      .catch((err) => {
        console.error('Failed to load ink demo:', err)
        setError(err.message)
      })
  }, [])

  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>
  }

  if (!Component) {
    return <div className="text-sm text-fd-muted-foreground">Loading terminal...</div>
  }

  return <Component />
}
