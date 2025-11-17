import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias Node.js built-ins to shims
      'cli-cursor': path.resolve(__dirname, '../../src/shims/cli-cursor.ts'),
      'supports-color': path.resolve(__dirname, '../../src/shims/supports-color.ts'),
      '#supports-color': path.resolve(__dirname, '../../src/shims/supports-color.ts'),
      'signal-exit': path.resolve(__dirname, '../../src/shims/signal-exit.ts'),
      'window-size': path.resolve(__dirname, '../../src/shims/window-size.ts'),
      tty: path.resolve(__dirname, '../../src/shims/tty.ts'),
      process: path.resolve(__dirname, '../../src/shims/process.ts'),
      'node:process': path.resolve(__dirname, '../../src/shims/process.ts'),
      events: path.resolve(__dirname, '../../src/shims/events.ts'),
      'node:events': path.resolve(__dirname, '../../src/shims/events.ts'),
      stream: path.resolve(__dirname, '../../src/shims/stream.ts'),
      'node:stream': path.resolve(__dirname, '../../src/shims/stream.ts'),
      module: path.resolve(__dirname, '../../src/shims/module.ts'),
      'node:module': path.resolve(__dirname, '../../src/shims/module.ts'),
      buffer: path.resolve(__dirname, '../../src/shims/buffer.ts'),
      'node:buffer': path.resolve(__dirname, '../../src/shims/buffer.ts'),
      fs: path.resolve(__dirname, '../../src/shims/fs.ts'),
      'node:fs': path.resolve(__dirname, '../../src/shims/fs.ts'),
      'node:path': 'path-browserify',
      // Chalk special handling
      'chalk-orig': 'chalk',
      chalk: path.resolve(__dirname, '../../src/shims/chalk.ts'),
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
    'process.env': {},
    'process.cwd': '() => "/"',
  },
})
