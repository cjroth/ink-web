// Polyfill setImmediate for browsers — Ink's unmount() relies on it internally.
// Unlike other shims which replace module imports via build aliases, setImmediate
// is a global that must be injected at runtime before Ink code executes.
if (typeof globalThis.setImmediate === 'undefined') {
  ;(globalThis as any).setImmediate = (fn: (...args: any[]) => void, ...args: any[]) => setTimeout(fn, 0, ...args)
}
