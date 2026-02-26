// Preload script for consistent test environment
// This MUST run before any test files are loaded
import { GlobalRegistrator } from '@happy-dom/global-registrator'

// Force color output to be consistent regardless of TTY detection
// Chalk caches color support at module load time based on tty.isatty()
// which can vary between test runs. Setting FORCE_COLOR ensures deterministic output.
process.env.FORCE_COLOR = '3'

// Register happy-dom globally for browser-like environment
// This must happen before any tests run to ensure xterm.js and other
// browser-dependent code can load properly
if (typeof document === 'undefined') {
  GlobalRegistrator.register()
}

// Ink uses a custom React reconciler (not React DOM), so React DOM's act()
// doesn't apply. Tests synchronize via renderForTest's waitForRender() instead.
globalThis.IS_REACT_ACT_ENVIRONMENT = false
