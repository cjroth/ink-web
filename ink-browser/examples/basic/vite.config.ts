import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { inkBrowserPlugin } from '../../dist/vite-plugin.js'

export default defineConfig({
  plugins: [react(), inkBrowserPlugin()],
})
