import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

export function inkWebPlugin(): Plugin {
  return {
    name: 'vite-plugin-ink-web',
    config() {
      // Resolve the path to the ink-web package
      // This works both when installed as a dependency and in development
      let inkWebPath: string
      try {
        // Try to resolve from node_modules (when installed as a dependency)
        inkWebPath = path.dirname(require.resolve('ink-web'))
      } catch {
        // Fallback for development using import.meta.url
        const __dirname = path.dirname(fileURLToPath(import.meta.url))
        inkWebPath = path.resolve(__dirname, '..')
      }

      return {
        resolve: {
          alias: {
            // Alias Node.js built-ins to shims
            'cli-cursor': path.resolve(inkWebPath, 'src/shims/cli-cursor.ts'),
            'supports-color': path.resolve(inkWebPath, 'src/shims/supports-color.ts'),
            '#supports-color': path.resolve(inkWebPath, 'src/shims/supports-color.ts'),
            'signal-exit': path.resolve(inkWebPath, 'src/shims/signal-exit.ts'),
            'window-size': path.resolve(inkWebPath, 'src/shims/window-size.ts'),
            tty: path.resolve(inkWebPath, 'src/shims/tty.ts'),
            process: path.resolve(inkWebPath, 'src/shims/process.ts'),
            'node:process': path.resolve(inkWebPath, 'src/shims/process.ts'),
            events: path.resolve(inkWebPath, 'src/shims/events.ts'),
            'node:events': path.resolve(inkWebPath, 'src/shims/events.ts'),
            stream: path.resolve(inkWebPath, 'src/shims/stream.ts'),
            'node:stream': path.resolve(inkWebPath, 'src/shims/stream.ts'),
            module: path.resolve(inkWebPath, 'src/shims/module.ts'),
            'node:module': path.resolve(inkWebPath, 'src/shims/module.ts'),
            buffer: path.resolve(inkWebPath, 'src/shims/buffer.ts'),
            'node:buffer': path.resolve(inkWebPath, 'src/shims/buffer.ts'),
            fs: path.resolve(inkWebPath, 'src/shims/fs.ts'),
            'node:fs': path.resolve(inkWebPath, 'src/shims/fs.ts'),
            'node:path': 'path-browserify',
            // Chalk special handling
            'chalk-orig': 'chalk',
            chalk: path.resolve(inkWebPath, 'src/shims/chalk.ts'),
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
