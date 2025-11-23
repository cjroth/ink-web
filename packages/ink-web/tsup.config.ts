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
    const aliases = shimAliasesForBundled(rootDir)

    // Match ALL imports and check if they're in our alias list
    build.onResolve({ filter: /.*/ }, (args) => {
      // Only handle bare imports (not relative or absolute paths)
      if (args.path.startsWith('.') || args.path.startsWith('/')) {
        return undefined
      }

      const replacement = aliases[args.path]
      if (replacement) {
        // If replacement is a path (starts with /), use it directly
        if (replacement.startsWith('/')) {
          return { path: replacement }
        }
        // For npm package references like 'path-browserify'
        return { path: replacement, external: false }
      }
      return undefined
    })
  },
})

export default defineConfig([
  // Standalone bundle - small, requires vite plugin (ink is external)
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
  // Bundled version - bundles Ink and shims but NOT React
  // Compatible with Next.js and other React 19+ environments
  {
    entry: {
      bundled: 'src/bundled.ts',
    },
    format: ['esm'],
    dts: true,
    sourcemap: true,
    target: 'esnext',
    platform: 'browser',
    splitting: false,
    minify: false,
    // Externalize React and related packages - they must be provided by the host app
    external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'scheduler', 'react-reconciler', 'xterm', '@xterm/addon-fit'],
    noExternal: [
      'ink',
      'chalk',
      'cli-cursor',
      'signal-exit',
      'window-size',
      'stack-utils',
      'code-excerpt',
      'ansi-escapes',
      'wrap-ansi',
      'yoga-layout', // MUST bundle yoga-layout, not externalize it
      'path-browserify',
      // Note: Node built-ins (fs, process, events, stream, etc.) are handled via esbuild alias
    ],
    esbuildPlugins: [nodeShimsPlugin(resolve(__dirname))],
    esbuildOptions(options) {
      options.format = 'esm'
      options.conditions = ['browser', 'production', 'module', 'import']
      options.mainFields = ['browser', 'module', 'main']
      options.alias = shimAliasesForBundled(resolve(__dirname))
      options.define = {
        'process.env.NODE_ENV': '"production"',
        __DEV__: 'false',
        'process.env.DEBUG': 'undefined',
        ...options.define,
      }
      // Make React and scheduler truly external - don't bundle them
      options.external = ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'scheduler', 'react-reconciler', 'xterm', '@xterm/addon-fit']
      // Add banner to provide require for external modules (similar to bundled)
      options.banner = {
        js: `
import * as __react__ from 'react';
import * as __react_dom__ from 'react-dom';
import * as __react_jsx_runtime__ from 'react/jsx-runtime';
import * as __scheduler__ from 'scheduler';
import * as __react_reconciler__ from 'react-reconciler';
import * as __xterm__ from 'xterm';
import * as __xterm_addon_fit__ from '@xterm/addon-fit';
// Provide require for CommonJS modules that need to import externals
const __EXTERNAL_MODULES__ = {
  'react': __react__,
  'react-dom': __react_dom__,
  'react/jsx-runtime': __react_jsx_runtime__,
  'scheduler': __scheduler__,
  'react-reconciler': __react_reconciler__,
  'xterm': __xterm__,
  '@xterm/addon-fit': __xterm_addon_fit__,
};
if (typeof globalThis.__bundled_require__ === 'undefined') {
  globalThis.__bundled_require__ = function(id) {
    if (__EXTERNAL_MODULES__[id]) return __EXTERNAL_MODULES__[id];
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
  // Next.js specific exports
  {
    entry: {
      next: 'src/next.ts',
    },
    format: ['esm'],
    dts: true,
    sourcemap: true,
    target: 'es2020',
    platform: 'browser',
    external: ['react', 'react-dom', 'next', 'next/dynamic', 'xterm', 'xterm/css/xterm.css', '@xterm/addon-fit', 'ink-web/bundled', 'ink-web/bundled/css'],
  },
  // SSR-safe utilities (pure functions, no browser dependencies)
  {
    entry: {
      utils: 'src/utils.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    target: 'es2020',
    platform: 'neutral',
  },
])
