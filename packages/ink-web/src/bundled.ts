// Bundled version - includes ink and all its dependencies with shims pre-applied
// Users don't need the vite plugin with this version

// Import CSS for InkTerminalBox
import './InkTerminalBox.css'

// Re-export everything from the main package
export { DemoApp } from './DemoApp'
export { InkTerminalBox } from './InkTerminalBox'
export { InkXterm } from './InkXterm'
export { mountInkInXterm } from './xterm-ink'
export type { InkWebOptions } from './xterm-ink'

// Re-export all of ink's exports with shims bundled in
export { Box, measureElement, Newline, render, Spacer, Static, Text, Transform, useApp, useFocus, useFocusManager, useInput, useIsScreenReaderEnabled, useStderr, useStdin, useStdout } from 'ink'

// Re-export types
export type { Instance, RenderOptions } from 'ink'

// Export yoga initialization helper (will be added by post-build script)
// This allows consumers to wait for yoga WASM to load before rendering
export const waitForYogaInit = (): Promise<void> => {
  const g = globalThis as any
  if (typeof g.__yogaPromise !== 'undefined') {
    return g.__yogaPromise.then(() => undefined)
  }
  return Promise.resolve()
}
