import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

export function inkBrowserPlugin(): Plugin {
  return {
    name: 'vite-plugin-ink-browser',
    config() {
      // Resolve the path to the ink-browser package
      // This works both when installed as a dependency and in development
      let inkBrowserPath: string
      try {
        // Try to resolve from node_modules (when installed as a dependency)
        inkBrowserPath = path.dirname(require.resolve('@ink-web/browser'))
      } catch {
        // Fallback for development using import.meta.url
        const __dirname = path.dirname(fileURLToPath(import.meta.url))
        inkBrowserPath = path.resolve(__dirname, '..')
      }

      return {
        resolve: {
          alias: {
            // Alias Node.js built-ins to shims
            'cli-cursor': path.resolve(inkBrowserPath, 'src/shims/cli-cursor.ts'),
            'supports-color': path.resolve(inkBrowserPath, 'src/shims/supports-color.ts'),
            '#supports-color': path.resolve(inkBrowserPath, 'src/shims/supports-color.ts'),
            'signal-exit': path.resolve(inkBrowserPath, 'src/shims/signal-exit.ts'),
            'window-size': path.resolve(inkBrowserPath, 'src/shims/window-size.ts'),
            tty: path.resolve(inkBrowserPath, 'src/shims/tty.ts'),
            process: path.resolve(inkBrowserPath, 'src/shims/process.ts'),
            'node:process': path.resolve(inkBrowserPath, 'src/shims/process.ts'),
            events: path.resolve(inkBrowserPath, 'src/shims/events.ts'),
            'node:events': path.resolve(inkBrowserPath, 'src/shims/events.ts'),
            stream: path.resolve(inkBrowserPath, 'src/shims/stream.ts'),
            'node:stream': path.resolve(inkBrowserPath, 'src/shims/stream.ts'),
            module: path.resolve(inkBrowserPath, 'src/shims/module.ts'),
            'node:module': path.resolve(inkBrowserPath, 'src/shims/module.ts'),
            buffer: path.resolve(inkBrowserPath, 'src/shims/buffer.ts'),
            'node:buffer': path.resolve(inkBrowserPath, 'src/shims/buffer.ts'),
            fs: path.resolve(inkBrowserPath, 'src/shims/fs.ts'),
            'node:fs': path.resolve(inkBrowserPath, 'src/shims/fs.ts'),
            'node:path': 'path-browserify',
            // Chalk special handling
            'chalk-orig': 'chalk',
            chalk: path.resolve(inkBrowserPath, 'src/shims/chalk.ts'),
          },
        },
        build: {
          target: 'esnext', // Support top-level await
        },
        optimizeDeps: {
          esbuildOptions: {
            target: 'esnext', // Support top-level await in dependencies
          },
        },
        define: {
          'process.env': '{}',
        },
      }
    },
  }
}
