import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import mdx from 'fumadocs-mdx/vite'
import path from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { inkBrowserAliases } from '../ink-browser/vite.aliases'
import * as MdxConfig from './source.config'

export default defineConfig({
  plugins: [
    mdx(MdxConfig),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths({
      root: __dirname,
    }),
  ],
  resolve: {
    alias: [{ find: '@/ink-browser', replacement: path.resolve(__dirname, '../ink-browser') }, ...inkBrowserAliases(path.resolve(__dirname, '../ink-browser'))],
    dedupe: ['react', 'react-dom'],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  define: {
    'process.env': {},
  },
})
