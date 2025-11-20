'use client'

import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
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
        <p className="text-4xl text-muted-foreground mb-2">CLIs in the browser & terminal.</p>
        <p className="text-lg text-muted-foreground mb-2">
          Ink Web is a browser runtime and cross-platform toolkit for{' '}
          <a href="https://github.com/vadimdemedes/ink" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
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
      <Accordions type="single" className="w-full max-w-3xl text-left">
        <Accordion title="How does it work?">Ink Web wraps Ink, polyfills the necessary Node.js APIs, and connects Ink to Xterm.js.</Accordion>
        <Accordion title="Is it compatible with existing Ink apps?">
          In theory! The React part of existing Ink apps should work with Ink Web - but if you've used other Node.js APIs - you'll need to modify those parts to work in a browser environment.
        </Accordion>
        <Accordion title="Is Ink Web production-ready?">No. This is a new and untested project that should be considered experimental.</Accordion>
        <Accordion title="What is Ink Web's relation to Ink?">
          Ink is a project by{' '}
          <a href="https://vadimdemedes.com/" className="underline hover:text-foreground">
            Vadim Demedes
          </a>
          . Ink Web is a separate project by{' '}
          <a href="https://cjroth.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            Chris Roth
          </a>
          , a different author.
        </Accordion>
      </Accordions>
    </div>
  )
}
