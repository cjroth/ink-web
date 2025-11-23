// Bundled version - bundles Ink and all shims but NOT React
// This version is compatible with Next.js and other React 19+ environments
// React must be provided by the host application

// Import CSS for InkTerminalBox
import './InkTerminalBox.css'

// Re-export everything from the main package
export { DemoApp } from './DemoApp'
export { InkTerminalBox, getTerminalHeight } from './InkTerminalBox'
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

