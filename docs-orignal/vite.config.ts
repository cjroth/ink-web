import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import mdx from 'fumadocs-mdx/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import * as MdxConfig from './source.config'

export default defineConfig(({ mode }) => ({
  plugins: [
    mdx(MdxConfig),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths({
      root: __dirname,
    }),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      stream: 'stream-browserify',
      buffer: 'buffer',
      process: 'process/browser.js',
      events: 'events',
      os: 'os-browserify/browser',
      fs: new URL('./fs-shim.ts', import.meta.url).pathname,
    },
    conditions: mode === 'production' ? ['production', 'browser', 'module', 'import'] : ['browser', 'module', 'import'],
    mainFields: ['browser', 'module', 'main'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    __DEV__: JSON.stringify(false),
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['ink-web'],
    include: ['stream-browserify', 'buffer', 'process', 'events', 'os-browserify/browser', '@xterm/addon-fit', 'xterm'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
        'process.env.NODE_ENV': '"production"',
        __DEV__: 'false',
      },
    },
  },
  build: {
    minify: 'esbuild',
  },
  server: {
    fs: {
      // Allow serving files from the parent directory (dist)
      allow: ['..', '../..'],
    },
  },
}))
