// Bundled version - includes ink and all its dependencies with shims pre-applied
// Users don't need the vite plugin with this version

// Re-export everything from the main package
export { InkXterm } from './InkXterm'
export { mountInkInXterm } from './xterm-ink'
export type { InkBrowserOptions } from './xterm-ink'

// Re-export all of ink's exports with shims bundled in
export { Box, Newline, Spacer, Static, Text, Transform, measureElement, render, useApp, useFocus, useFocusManager, useInput, useIsScreenReaderEnabled, useStderr, useStdin, useStdout } from 'ink'

// Re-export types
export type { Instance, RenderOptions } from 'ink'
