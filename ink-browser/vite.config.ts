import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { inkBrowserAliases } from './vite.aliases'

export default defineConfig({
  root: path.resolve(__dirname, 'demo'),
  plugins: [react()],
  resolve: {
    alias: [...inkBrowserAliases(__dirname)],
  },
  server: {
    port: 5175,
    strictPort: true,
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
})
