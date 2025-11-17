import { createMDX } from 'fumadocs-mdx/next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Add shims for Node.js modules to work in browser (only for client-side)
    if (!isServer) {
      const shimPath = (p) => path.resolve(__dirname, 'lib/ink-browser/shims', p)

      config.resolve.alias = {
        ...config.resolve.alias,
        'cli-cursor': shimPath('cli-cursor.ts'),
        'supports-color': shimPath('supports-color.ts'),
        '#supports-color': shimPath('supports-color.ts'),
        'signal-exit': shimPath('signal-exit.ts'),
        'window-size': shimPath('window-size.ts'),
        tty: shimPath('tty.ts'),
        process: shimPath('process.ts'),
        'node:process': shimPath('process.ts'),
        events: shimPath('events.ts'),
        'node:events': shimPath('events.ts'),
        stream: shimPath('stream.ts'),
        'node:stream': shimPath('stream.ts'),
        module: shimPath('module.ts'),
        'node:module': shimPath('module.ts'),
        buffer: shimPath('buffer.ts'),
        'node:buffer': shimPath('buffer.ts'),
        fs: shimPath('fs.ts'),
        'node:fs': shimPath('fs.ts'),
      }

      // Provide fallbacks for Node.js core modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      }
    }

    return config
  },
}

export default withMDX(config)
