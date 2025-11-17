import { inkBrowserPlugin } from '@ink-web/browser/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), inkBrowserPlugin()],
})
