import { dirname, resolve } from 'path'
import { defineConfig } from 'tsup'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'vite-plugin': 'src/vite-plugin.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2020',
  platform: 'browser',
  external: ['react', 'react-dom', 'ink', 'xterm', '@xterm/addon-fit', 'vite', 'path'],
  noExternal: [
    // Bundle these packages and their dependencies (which will hit our shims)
    'chalk',
    'cli-cursor',
    'supports-color',
    'signal-exit',
    'window-size',
  ],
  esbuildOptions(options) {
    // Provide shims for Node.js built-ins that Ink and dependencies might import
    // Our shims will be bundled into the output so consumers don't need config
    const rootDir = resolve(__dirname)
    options.alias = {
      // Chalk and its dependencies
      chalk: resolve(rootDir, 'src/shims/chalk.ts'),
      'chalk-orig': 'chalk',
      '#supports-color': resolve(rootDir, 'src/shims/supports-color.ts'),
      'supports-color': resolve(rootDir, 'src/shims/supports-color.ts'),

      // CLI utilities that Ink uses
      'cli-cursor': resolve(rootDir, 'src/shims/cli-cursor.ts'),
      'signal-exit': resolve(rootDir, 'src/shims/signal-exit.ts'),
      'window-size': resolve(rootDir, 'src/shims/window-size.ts'),

      // Node.js built-ins (both with and without 'node:' prefix)
      tty: resolve(rootDir, 'src/shims/tty.ts'),
      process: resolve(rootDir, 'src/shims/process.ts'),
      'node:process': resolve(rootDir, 'src/shims/process.ts'),
      events: resolve(rootDir, 'src/shims/events.ts'),
      'node:events': resolve(rootDir, 'src/shims/events.ts'),
      stream: resolve(rootDir, 'src/shims/stream.ts'),
      'node:stream': resolve(rootDir, 'src/shims/stream.ts'),
      module: resolve(rootDir, 'src/shims/module.ts'),
      'node:module': resolve(rootDir, 'src/shims/module.ts'),
      buffer: resolve(rootDir, 'src/shims/buffer.ts'),
      'node:buffer': resolve(rootDir, 'src/shims/buffer.ts'),
      fs: resolve(rootDir, 'src/shims/fs.ts'),
      'node:fs': resolve(rootDir, 'src/shims/fs.ts'),
    }
  },
})
