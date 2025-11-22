'use client'

import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import dynamic from 'next/dynamic'
import { MacWindow } from 'ink-web/ui'

const InkDemo = dynamic(() => import('../components/InkDemo').then((mod) => ({ default: mod.InkDemo })), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-muted animate-pulse rounded-lg" />,
})

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center text-center flex-1 gap-8 p-8">
      <div className="max-w-xl">
        <p className="text-4xl text-muted-foreground mb-2">CLIs in the browser & terminal.</p>
        <p className="text-lg text-muted-foreground mb-2 mt-8">
          Ink Web is a way to build interactive command-line apps with <a href="https://github.com/vadimdemedes/ink" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            Ink
          </a> and React that run in the browser as well as in the terminal.
        </p>
      </div>
      <MacWindow className="w-full max-w-3xl mt-4">
        <InkDemo />
      </MacWindow>
      <Accordions type="single" className="w-full max-w-3xl text-left mt-8">
        <Accordion title="How does it work?">Ink Web wraps Ink, polyfills the necessary Node.js APIs, and connects Ink to Xterm.js.</Accordion>
        <Accordion title="Is it compatible with existing Ink apps?">
          In theory! The React part of existing Ink apps should work with Ink Web - but if you've used other Node.js APIs - you'll need to modify those parts to work in a browser environment.
        </Accordion>
        <Accordion title="Why not webcontainers.io?">
          To be honest, <a href="https://webcontainers.io/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            web containers
          </a> are often a better choice since they offer a fully containerized Node.js environment. Ink Web is more of a lightweight solution with slightly faster load time if you don't need Node.js APIs and want to build cross-platform React-based CLIs using TSX right into your existing page. If you want to avoid including the webcontainers wasm bundle and proxing data between a container and your app, Ink Web could be a better option.
        </Accordion>
        <Accordion title="What about filesystem access?">
          You can use a library like <a href="https://github.com/isomorphic-git/lightning-fs" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            lightning-fs
          </a> or build an abstraction that uses <a href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            OPFS
          </a> in the browser and the fs module in Node.js.
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
          </a>.
        </Accordion>
      </Accordions>
    </div>
  )
}
