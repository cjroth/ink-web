import { MacWindow } from '@/components/ui/mac-window'
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { HomeDemo } from './home-demo'

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
        <HomeDemo />
      </MacWindow>
      <Accordions type="single" className="w-full max-w-3xl text-left mt-8">
        <Accordion title="Why?">
          I built Ink Web because I wanted a web-first, cross-platform app with an integrated CLI. After running into limitations with existing solutions, I found that rendering Ink components in a terminal emulator worked surprisingly well. Also, Ink Web can be embedded directly into docs like Fumadocs, Nextra, etc.
        </Accordion>
        <Accordion title="How does it work?">Ink Web wraps Ink, polyfills the necessary Node.js APIs, and connects Ink to <a href="https://github.com/coder/ghostty-web" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">ghostty-web</a> for terminal rendering.</Accordion>
        <Accordion title="Is it compatible with existing Ink apps?">
          The React part of existing Ink apps should work with Ink Web - but you'll need to modify any Node.js-specific code to work in a browser environment.
        </Accordion>
        <Accordion title="Why not webcontainers.io?">
          <a href="https://webcontainers.io/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            Web Containers
          </a> are a better choice for many use cases since they offer a fully containerized Node.js environment. Ink Web is a lighter-weight solution if you don't need Node.js APIs and want to build cross-platform React-based CLIs using TSX right into your existing page.
        </Accordion>
        <Accordion title="What about filesystem access?">
          You can use a library like <a href="https://github.com/isomorphic-git/lightning-fs" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            lightning-fs
          </a> or build an abstraction that uses <a href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            OPFS
          </a> in the browser and the fs module in Node.js.
        </Accordion>
        <Accordion title="Is Ink Web production-ready?">No. This is a new and untested project that should be considered experimental. Use it at your own risk.</Accordion>
        <Accordion title="What is Ink Web's relation to Ink?">
         Ink Web is not affiliated with or endorsed by the maintainers of Ink. Ink Web is a separate project by{' '}
          <a href="https://cjroth.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            Chris Roth
          </a>.
        </Accordion>
        <Accordion title="Why not rewrite Ink for web environments?">
          When building Ink Web, I experimented with this. Ultimately, I concluded that Ink is a mature, battle-tested library used by Claude Code, Gemeni CLI, and many others and that it would be better to build on the existing Ink ecosystem. Ink has put a lot of work into dealing with tricky edge cases and creating a custom React renderer for Yoga.
        </Accordion>
      </Accordions>
    </div>
  )
}
