import type { Plugin } from 'esbuild'
import { dirname, resolve } from 'path'
import { defineConfig } from 'tsup'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const shimAliasesForBundled = (rootDir: string) => ({
  // Don't shim chalk - let it bundle naturally
  '#supports-color': resolve(rootDir, 'src/shims/supports-color.ts'),
  'supports-color': resolve(rootDir, 'src/shims/supports-color.ts'),

  // CLI utilities that Ink uses
  'cli-cursor': resolve(rootDir, 'src/shims/cli-cursor.ts'),
  'signal-exit': resolve(rootDir, 'src/shims/signal-exit.ts'),
  'window-size': resolve(rootDir, 'src/shims/window-size.ts'),

  // Optional dev dependencies
  'react-devtools-core': resolve(rootDir, 'src/shims/react-devtools-core.ts'),

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
  'node:path': 'path-browserify',
  os: resolve(rootDir, 'src/shims/os.ts'),
  'node:os': resolve(rootDir, 'src/shims/os.ts'),
})

const shimAliases = (rootDir: string) => ({
  ...shimAliasesForBundled(rootDir),
  // Chalk shim only for plugin-based approach
  chalk: resolve(rootDir, 'src/shims/chalk.ts'),
  'chalk-orig': 'chalk',
})

// Esbuild plugin to resolve Node.js built-ins to our shims
const nodeShimsPlugin = (rootDir: string): Plugin => ({
  name: 'node-shims',
  setup(build) {
    const aliases = shimAliases(rootDir)

    // Special handling for chalk-orig -> chalk
    build.onResolve({ filter: /^chalk-orig$/ }, async (args) => {
      const result = await build.resolve('chalk', {
        resolveDir: args.resolveDir,
        kind: args.kind,
      })
      return result
    })

    // Intercept all imports and resolve node built-ins to our shims
    Object.entries(aliases).forEach(([find, replacement]) => {
      build.onResolve({ filter: new RegExp(`^${find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }, () => {
        // Skip aliases that point to npm packages (not absolute paths)
        if (!replacement.startsWith('/') && !replacement.includes(rootDir)) {
          return undefined // Let esbuild handle it normally
        }
        // Return with explicit external: false to force bundling
        return { path: replacement, external: false }
      })
    })
  },
})

export default defineConfig([
  // Main bundle - small, requires vite plugin (ink is external)
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    target: 'es2020',
    platform: 'browser',
    external: ['react', 'react-dom', 'ink', 'xterm', '@xterm/addon-fit'],
  },
  // Bundled version - large, no plugin needed (ink is bundled with shims)
  {
    entry: {
      bundled: 'src/bundled.ts',
    },
    format: ['esm'], // Only ESM since ink uses top-level await (not supported in CJS)
    dts: true,
    sourcemap: true,
    target: 'esnext', // Support top-level await for ink's dependencies
    platform: 'browser', // Browser platform for proper module resolution
    splitting: false, // Disable code splitting to keep everything in one bundle
    minify: false, // Keep readable for debugging (define will still remove dev code)
    // Externalize React and xterm - they must be shared with the app
    external: ['react', 'react-dom', 'react/jsx-runtime', 'xterm', '@xterm/addon-fit'],
    noExternal: [
      'ink',
      // Force node built-ins to be bundled (will be resolved via aliases)
      'stream',
      'process',
      'events',
      'buffer',
      'os',
      'fs',
      'tty',
      'module',
      'chalk',
      'stream-browserify',
      'buffer',
      'process',
      'events',
      'os-browserify',
    ],
    esbuildPlugins: [nodeShimsPlugin(resolve(__dirname))],
    esbuildOptions(options) {
      options.format = 'esm' // Force ESM output
      options.conditions = ['browser', 'production', 'module', 'import']
      options.mainFields = ['browser', 'module', 'main']
      // Use alias to map node built-ins to our shims (but not chalk - let it bundle)
      options.alias = shimAliasesForBundled(resolve(__dirname))
      // Define NODE_ENV and __DEV__ to ensure production mode
      options.define = {
        'process.env.NODE_ENV': '"production"',
        __DEV__: 'false',
        'process.env.DEBUG': 'undefined',
        ...options.define,
      }
      // Prevent esbuild from creating require() wrappers for externals
      options.banner = {
        js: `
import * as __react__ from 'react';
import * as __react_dom__ from 'react-dom';
import * as __react_jsx_runtime__ from 'react/jsx-runtime';
// Provide require for CommonJS modules that need to import externals
if (typeof globalThis.__bundled_require__ === 'undefined') {
  globalThis.__bundled_require__ = function(id) {
    if (id === 'react') return __react__;
    if (id === 'react-dom') return __react_dom__;
    if (id === 'react/jsx-runtime') return __react_jsx_runtime__;
    throw new Error('Cannot find module: ' + id);
  };
}
const require = globalThis.__bundled_require__;
        `.trim(),
      }
    },
  },
  // Node.js bundle for Vite plugin
  {
    entry: {
      'vite-plugin': 'src/vite-plugin.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    target: 'es2020',
    platform: 'node',
    external: ['vite', 'path', 'node:path', 'node:url', 'url'],
  },
])
