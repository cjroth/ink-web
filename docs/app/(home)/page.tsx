'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const InkDemo = dynamic(() => import('../components/InkDemo').then((mod) => ({ default: mod.InkDemo })), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-muted animate-pulse rounded-lg" />,
})

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center text-center flex-1 gap-8 p-8">
      <div>
        <p className="text-4xl text-muted-foreground mb-2">
          CLIs for the browser <em>and</em> terminal.
        </p>
        <p className="text-lg text-muted-foreground mb-2">
          Ink Web is a browser runtime and cross-platform toolkit for{' '}
          <a href="https://github.com/vadimdemedes/ink" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 transition-opacity">
            Ink
          </a>
          .
        </p>
      </div>
      <div className="w-full max-w-3xl">
        <InkDemo />
      </div>
      <Link
        href="/docs"
        className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-black dark:bg-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
      >
        View Docs
      </Link>
    </div>
  )
}
