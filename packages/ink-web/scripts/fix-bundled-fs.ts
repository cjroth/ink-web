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
