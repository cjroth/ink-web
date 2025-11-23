#!/usr/bin/env bun
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

// Replace the fs import with our shim inline
const fsShim = `
const fs = {
  existsSync: () => false,
  readFileSync: () => ''
};
`

// Minimal process shim for destructured imports like { env }
const processShim = `
const process = {
  cwd: () => '/',
  env: typeof window !== 'undefined' ? (window).__ENV__ ?? {} : {},
};
`

// EventEmitter shim for imports that reference it before the bundled shim is defined
const eventEmitterShim = `
class EventEmitter {
  constructor() { this._listeners = new Map(); }
  on(e, l) { let s = this._listeners.get(e); if (!s) { s = new Set(); this._listeners.set(e, s); } s.add(l); return this; }
  off(e, l) { const s = this._listeners.get(e); if (s) s.delete(l); return this; }
  emit(e, ...a) { const s = this._listeners.get(e); if (!s) return false; for (const l of s) l(...a); return true; }
  addListener(e, l) { return this.on(e, l); }
  removeListener(e, l) { return this.off(e, l); }
  removeAllListeners(e) { if (e) this._listeners.delete(e); else this._listeners.clear(); return this; }
  once(e, l) { const w = (...a) => { this.off(e, w); l(...a); }; return this.on(e, w); }
}
`

// Stream shim - uses unique internal names to avoid conflicts with bundled shim
// The bundled shim also defines Readable/Writable but later in the file
const streamShim = `
const __InkStream = class extends EventEmitter {};
const __InkWritable = class extends __InkStream {
  constructor() { super(); this.writable = true; }
  write(c, e, cb) { this.emit('data', typeof c === 'string' ? c : String(c)); if (cb) cb(); return true; }
  end() { this.emit('end'); }
};
const __InkReadable = class extends __InkStream {
  constructor() { super(); this.readable = true; }
  setEncoding() { return this; }
  resume() { return this; }
  pause() { return this; }
  pipe(d) { return d; }
};
const __InkPassThrough = class extends __InkWritable {};
var Stream = __InkStream;
var PassThrough = __InkPassThrough;
`


function fixFile(filePath: string, fileName: string, fixReact: boolean = true) {
  let content = readFileSync(filePath, 'utf-8')

  // Remove yoga-layout from external imports banner (since it's now bundled)
  content = content.replace(/import \* as __yoga_layout__ from ['"]yoga-layout['"];?\n?/g, '')
  content = content.replace(/['"]yoga-layout['"]: __yoga_layout__,?\n?/g, '')

  // Fix the top-level await in yoga-layout initialization
  // Replace: var Yoga = wrapAssembly(await yoga_wasm_base64_esm_default());
  // With eager initialization that doesn't use top-level await
  content = content.replace(
    /var Yoga = wrapAssembly\(await yoga_wasm_base64_esm_default\(\)\);/g,
    `// Initialize Yoga without top-level await to avoid Next.js issues
let __yogaInstance = null;
let __yogaPromise = null;

// Start loading immediately
__yogaPromise = yoga_wasm_base64_esm_default().then(wasm => {
  __yogaInstance = wrapAssembly(wasm);
  console.log('[Yoga] WASM initialized successfully');
  return __yogaInstance;
}).catch(err => {
  console.error('[Yoga] Failed to initialize WASM:', err);
  throw err;
});

// Export a Proxy that forwards to the real instance once loaded
const Yoga = new Proxy({}, {
  get(target, prop) {
    // Allow checking if yoga is initialized
    if (prop === '__initialized') {
      return () => __yogaInstance !== null;
    }
    if (prop === '__init') {
      return () => __yogaPromise;
    }
    if (prop === '__getYogaInstance') {
      return () => __yogaInstance;
    }
    
    // Forward to the real yoga instance
    if (__yogaInstance) {
      // Just return the value directly from the yoga instance
      // Don't try to proxy nested objects - just return them as-is
      const value = __yogaInstance[prop];
      if (typeof value === 'undefined') {
        console.warn(\`[Yoga Proxy] Warning: Property \${String(prop)} is undefined on Yoga instance\`);
      }
      
      // If the value is the Node class, we need to proxy it too to handle static methods like create()
      if (prop === 'Node') {
        return new Proxy(value, {
          get(nodeTarget, nodeProp) {
             const nodeValue = nodeTarget[nodeProp];
             if (nodeProp === 'create') {
               return (...args) => {
                 const node = nodeValue.apply(nodeTarget, args);
                 // We need to ensure the created node methods are bound or proxied correctly
                 // specifically for setMeasureFunc which takes a callback
                 const originalSetMeasureFunc = node.setMeasureFunc;
                 node.setMeasureFunc = function(func) {
                   // Wrap the measure function to ensure it returns an object with width/height
                   // and handles any potential context issues
                   const wrappedFunc = (...args) => {
                     try {
                       const result = func(...args);
                       return result;
                     } catch (e) {
                       console.error('[Yoga Proxy] Error in measure function:', e);
                       return { width: 0, height: 0 };
                     }
                   };
                   return originalSetMeasureFunc.call(this, wrappedFunc);
                 };
                 return node;
               };
             }
             return nodeValue;
          }
        });
      }

      return value;
    }
    
    // If not yet loaded, throw error with details
    const error = new Error(\`[Yoga Proxy] WASM not initialized. Property: \${String(prop)}\`);
    console.error(error);
    throw error;
  }
});

// Make the promise available globally for waitForYogaInit
if (typeof globalThis !== 'undefined') {
  globalThis.__yogaPromise = __yogaPromise;
}`
  )

  // Replace import * as fs from "fs" or import * as fs from 'fs'
  content = content.replace(/import \* as fs from ['"]fs['"];/g, fsShim.trim())

  // Also handle node:fs
  content = content.replace(/import \* as fs from ['"]node:fs['"];/g, fsShim.trim())

  // Fix node builtin imports (process, events, stream)
  // The actual shim files (src/shims/*.ts) are already bundled by esbuild
  // We just need to remove any remaining external imports that weren't resolved

  // Remove any remaining external imports for process/events/stream
  // These should have been resolved to shims but some may slip through
  const removedImports: string[] = []

  // Handle process imports - need to preserve named imports like { env }
  // Replace: import { env } from "process" -> const { env } = process
  let needsProcessShim = false
  if (content.match(/import \{ ([^}]+) \} from ['"](?:node:)?process['"];/)) {
    content = content.replace(/import \{ ([^}]+) \} from ['"](?:node:)?process['"];/g, (match, imports) => {
      return `const { ${imports} } = process;`
    })
    needsProcessShim = true
    removedImports.push('process (named)')
  }

  // Replace default process imports with assignments to our shim
  // e.g., import process3 from "process" -> const process3 = process
  if (content.match(/import (\w+) from ['"](?:node:)?process['"];/)) {
    content = content.replace(/import (\w+) from ['"](?:node:)?process['"];/g, (match, varName) => {
      return `const ${varName} = process;`
    })
    needsProcessShim = true
    removedImports.push('process')
  }

  // Handle events imports - need EventEmitter to be defined
  let needsEventEmitterShim = false
  if (content.match(/import .* from ['"](?:node:)?events['"];/)) {
    // Replace aliased imports: import { EventEmitter as EventEmitter2 } -> const EventEmitter2 = EventEmitter
    content = content.replace(/import \{ EventEmitter as (\w+) \} from ['"](?:node:)?events['"];/g, (match, alias) => {
      return `const ${alias} = EventEmitter;`
    })
    // Remove plain imports: import { EventEmitter } from "events"
    content = content.replace(/import \{ EventEmitter \} from ['"](?:node:)?events['"];/g, '')
    needsEventEmitterShim = true
    removedImports.push('events')
  }

  // Handle stream imports - need to provide Stream/PassThrough early
  // The bundled shim defines Readable/Writable later
  let needsStreamShim = false
  if (content.match(/import .* from ['"](?:node:)?stream['"];/)) {
    content = content.replace(/import \{[^}]+\} from ['"](?:node:)?stream['"];/g, '')
    needsStreamShim = true
    needsEventEmitterShim = true // Stream depends on EventEmitter
    removedImports.push('stream')
  }

  // Insert shims at the top in correct order: process, EventEmitter, Stream
  const bannerEndMarker = 'const require = globalThis.__bundled_require__;'
  let shimsToInsert = ''
  if (needsProcessShim) shimsToInsert += processShim.trim() + '\n'
  if (needsEventEmitterShim) shimsToInsert += eventEmitterShim.trim() + '\n'
  if (needsStreamShim) shimsToInsert += streamShim.trim() + '\n'

  if (shimsToInsert) {
    if (content.includes(bannerEndMarker)) {
      content = content.replace(bannerEndMarker, bannerEndMarker + '\n' + shimsToInsert.trim())
    } else {
      content = shimsToInsert.trim() + '\n' + content
    }
  }

  if (removedImports.length > 0) {
    console.log(`✅ Removed external imports for: ${removedImports.join(', ')}`)
  }

  // For semi-bundled: Fix dynamic require calls for external modules
  if (!fixReact) {
    // The banner adds __react__ and __scheduler__, so we need to replace references
    // Replace __require("react") with __react__
    content = content.replace(/__require\(["']react["']\)/g, '__react__')

    // Replace __require("scheduler") with __scheduler__
    content = content.replace(/__require\(["']scheduler["']\)/g, '__scheduler__')
  }

  if (fixReact) {
    // Replace all uses of the bundled React with the external React
    // This is a simpler, more reliable approach than trying to remove the CommonJS definitions

    // Replace all import_react* = __toESM(require_react*()) calls
    content = content.replace(/var import_react(\d*) = __toESM\(require_react[^)]*\(\)[^)]*\);/g, 'var import_react$1 = __react__;')

    // Replace module.exports = require_react_production() in require_react
    content = content.replace(/module\.exports = require_react_production\(\);/g, 'module.exports = __react__;')

    // Replace all standalone require_react() or require_react_production() calls
    content = content.replace(/\brequire_react(?:_production)?\(\)/g, '__react__')
  }

  writeFileSync(filePath, content, 'utf-8')
  console.log(`✅ Fixed fs${fixReact ? ' and React' : ''} imports in ${fileName}`)
}

// Fix bundled.js (without React fixes since React is external)
const bundledPath = resolve(import.meta.dir, '../dist/bundled.js')
fixFile(bundledPath, 'bundled.js', false)

// Create CSS type declaration file
const cssDeclarationPath = resolve(import.meta.dir, '../dist/bundled.css.d.ts')
writeFileSync(cssDeclarationPath, 'export {};\n', 'utf-8')
console.log('✅ Created bundled.css.d.ts')
