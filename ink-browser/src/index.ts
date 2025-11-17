export { InkXterm } from './InkXterm'
export { mountInkInXterm } from './xterm-ink'
export type { InkBrowserOptions } from './xterm-ink'

// Note: If using the plugin in a Vite config, import from '@ink-web/browser/vite' instead
// to avoid loading browser dependencies during config evaluation
export { inkBrowserPlugin } from './vite-plugin'
