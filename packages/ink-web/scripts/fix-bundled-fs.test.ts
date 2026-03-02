import { describe, expect, test, beforeAll } from 'bun:test'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const distPath = resolve(import.meta.dir, '../dist/index.js')

let distContent: string

beforeAll(() => {
  if (!existsSync(distPath)) {
    throw new Error(
      'dist/index.js not found — run `bun run build` before running these tests'
    )
  }
  distContent = readFileSync(distPath, 'utf-8')
})

// ──────────────────────────────────────────────────────────────────────────────
// Issue #1: EventEmitter banner shim missing setMaxListeners / listeners / listenerCount
//
// Ink 6.8.0's App component calls `internal_eventEmitter.current.setMaxListeners(Infinity)`
// during render.  The banner EventEmitter (injected at top of dist/index.js) was missing
// that method, causing a TypeError that the reconciler's empty error callbacks silently
// swallowed — resulting in a blank terminal with zero rendered output.
// ──────────────────────────────────────────────────────────────────────────────
describe('EventEmitter banner shim', () => {
  // Extract just the banner EventEmitter class from the dist output.
  // It starts with `class EventEmitter {` and ends at the next line that is just `}`.
  function extractBannerShim(): string {
    const lines = distContent.split('\n')
    const startIdx = lines.findIndex((l) => l.trim() === 'class EventEmitter {')
    expect(startIdx).toBeGreaterThanOrEqual(0)

    // Find the closing `}` — the banner shim methods are all one-liners,
    // so the first line that is just `}` after the class open is the end.
    let endIdx = startIdx + 1
    while (endIdx < lines.length && lines[endIdx].trim() !== '}') {
      endIdx++
    }
    return lines.slice(startIdx, endIdx + 1).join('\n')
  }

  test('banner shim has setMaxListeners method', () => {
    const shimCode = extractBannerShim()
    const fn = new Function(shimCode + '\nreturn new EventEmitter();')
    const ee = fn()

    // This is the exact call that crashed: internal_eventEmitter.current.setMaxListeners(Infinity)
    expect(() => ee.setMaxListeners(Infinity)).not.toThrow()
    expect(ee.setMaxListeners(Infinity)).toBe(ee) // must be chainable
  })

  test('banner shim has listeners method', () => {
    const shimCode = extractBannerShim()
    const fn = new Function(shimCode + '\nconst ee = new EventEmitter(); ee.on("x", () => {}); return ee.listeners("x");')
    expect(fn()).toHaveLength(1)
  })

  test('banner shim has listenerCount method', () => {
    const shimCode = extractBannerShim()
    const fn = new Function(shimCode + '\nconst ee = new EventEmitter(); ee.on("x", () => {}); return ee.listenerCount("x");')
    expect(fn()).toBe(1)
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// Issue #2: createContainer error callbacks were empty (() => {})
//
// react-reconciler's createContainer takes onUncaughtError, onCaughtError, and
// onRecoverableError callbacks.  Ink's bundled code set them all to () => {},
// which silently swallowed the setMaxListeners TypeError above.  Now they log.
// ──────────────────────────────────────────────────────────────────────────────
describe('createContainer error callbacks', () => {
  test('error callbacks log to console (not empty)', () => {
    expect(distContent).toContain('[ink-web] Uncaught error in render:')
    expect(distContent).toContain('[ink-web] Caught error in render:')
    expect(distContent).toContain('[ink-web] Recoverable error in render:')
  })

  test('no empty error callbacks in createContainer call', () => {
    // The old broken pattern: four consecutive empty arrow functions
    const emptyCallbacksPattern =
      'reconciler_default.createContainer(this.rootNode, rootTag, null, false, null, "id", () => {\n    }, () => {\n    }, () => {\n    }, () => {\n    })'
    expect(distContent).not.toContain(emptyCallbacksPattern)
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// Issue #3: loadPackageJson() used top-level await + dynamic import("fs")
//
// ink 6.8.0 added loadPackageJson() which does `await import("fs")` at module
// scope.  Turbopack treats any `import("fs")` as a real import specifier and
// top-level await makes the entire module async, breaking CJS interop.
// ──────────────────────────────────────────────────────────────────────────────
describe('loadPackageJson replacement', () => {
  test('loadPackageJson is a no-op stub', () => {
    expect(distContent).toContain(
      'async function loadPackageJson() { return { name: undefined, version: undefined }; }'
    )
  })

  test('no top-level await for packageJson', () => {
    expect(distContent).not.toContain('await loadPackageJson()')
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// Issue #4: devtools top-level await
//
// ink 6.8.0 has `if (isDev()) { try { await Promise.resolve()... } }` which
// makes the module async even though isDev() is always false in browser.
// Turbopack static analysis sees the `await` and breaks.
// ──────────────────────────────────────────────────────────────────────────────
describe('devtools await removal', () => {
  test('no top-level await in devtools block', () => {
    // The original pattern: if (isDev()) { try { await Promise.resolve()...
    expect(distContent).not.toMatch(/if \(isDev\(\)\) \{\s*try \{\s*await/)
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// Issue #5: Missing Node.js module shims (os, Buffer, fs, child_process, tty)
//
// The bundled dist must not have bare imports of Node.js built-in modules
// since it runs in the browser.  Each must be replaced with a browser shim.
// ──────────────────────────────────────────────────────────────────────────────
describe('Node.js module shims', () => {
  test('no bare import of "os"', () => {
    expect(distContent).not.toMatch(/import os from ["']os["']/)
    expect(distContent).not.toMatch(/import os from ["']node:os["']/)
  })

  test('os shim is present with platform/homedir/tmpdir', () => {
    // The replacement shim should provide these browser-safe stubs
    expect(distContent).toMatch(/var os = \{/)
    expect(distContent).toContain('platform: () => "browser"')
  })

  test('no bare import of "fs"', () => {
    expect(distContent).not.toMatch(/import \* as \w+ from ["'](?:node:)?fs["'];/)
    expect(distContent).not.toMatch(/import \w+ from ["'](?:node:)?fs["'];/)
  })

  test('no dynamic await import("fs")', () => {
    expect(distContent).not.toContain('await import("fs")')
    expect(distContent).not.toContain("await import('fs')")
    expect(distContent).not.toContain('await import("node:fs")')
    expect(distContent).not.toContain("await import('node:fs')")
  })

  test('no bare import of "child_process"', () => {
    expect(distContent).not.toMatch(
      /import .+ from ["'](?:node:)?child_process["'];/
    )
  })

  test('no bare import of "tty"', () => {
    expect(distContent).not.toMatch(/import \w+ from ["'](?:node:)?tty["'];/)
  })

  test('Buffer import is shimmed', () => {
    // Should not have bare Buffer import from "buffer"
    expect(distContent).not.toMatch(
      /import \{ Buffer as \w+ \} from ["']buffer["'];/
    )
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// Issue #6: Yoga WASM top-level await
//
// The original `var Yoga = wrapAssembly(await yoga_wasm_base64_esm_default())`
// is a top-level await that breaks in Turbopack.  It must be replaced with the
// Proxy-based lazy initialization pattern.
// ──────────────────────────────────────────────────────────────────────────────
describe('Yoga WASM initialization', () => {
  test('no top-level await for Yoga', () => {
    expect(distContent).not.toContain(
      'var Yoga = wrapAssembly(await yoga_wasm_base64_esm_default())'
    )
  })

  test('uses Proxy-based lazy initialization', () => {
    expect(distContent).toContain('__yogaPromise')
    expect(distContent).toContain('__yogaInstance')
    expect(distContent).toContain('new Proxy(')
  })
})
