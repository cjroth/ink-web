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
  content = content.replace(
    /import \* as __yoga_layout__ from ['"]yoga-layout['"];?\n?/g,
    ''
  )
  content = content.replace(
    /['"]yoga-layout['"]: __yoga_layout__,?\n?/g,
    ''
  )

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
  return __yogaInstance;
}).catch(err => {
  console.error('Failed to initialize Yoga WASM:', err);
  throw err;
});

// Export a synchronous Yoga object that will be populated once loaded
const Yoga = {
  Node: {
    create: function() {
      if (!__yogaInstance) {
        throw new Error('Yoga WASM not yet initialized. Please ensure yoga loads before creating nodes.');
      }
      return __yogaInstance.Node.create();
    }
  },
  Config: {
    create: function() {
      if (!__yogaInstance) {
        throw new Error('Yoga WASM not yet initialized.');
      }
      return __yogaInstance.Config.create();
    }
  },
  // Add a helper to wait for yoga to load
  __initialized: () => __yogaInstance !== null,
  __init: () => __yogaPromise,
  // Proxy remaining properties
  __getYogaInstance: () => __yogaInstance
};

// Copy all constants from yoga when it loads
__yogaPromise.then(yoga => {
  Object.keys(yoga).forEach(key => {
    if (key !== 'Node' && key !== 'Config' && !key.startsWith('__')) {
      Yoga[key] = yoga[key];
    }
  });
});

// Make the promise available globally for waitForYogaInit
if (typeof globalThis !== 'undefined') {
  globalThis.__yogaPromise = __yogaPromise;
}`
  )

  // Replace import * as fs from "fs" or import * as fs from 'fs'
  content = content.replace(
    /import \* as fs from ['"]fs['"];/g,
    fsShim.trim()
  )

  // Also handle node:fs
  content = content.replace(
    /import \* as fs from ['"]node:fs['"];/g,
    fsShim.trim()
  )

  // For semi-bundled: Fix dynamic require calls for external modules
  if (!fixReact) {
    // The banner adds __react__ and __scheduler__, so we need to replace references
    // Replace __require("react") with __react__
    content = content.replace(
      /__require\(["']react["']\)/g,
      '__react__'
    )
    
    // Replace __require("scheduler") with __scheduler__
    content = content.replace(
      /__require\(["']scheduler["']\)/g,
      '__scheduler__'
    )
  }

  if (fixReact) {
    // Replace all uses of the bundled React with the external React
    // This is a simpler, more reliable approach than trying to remove the CommonJS definitions

    // Replace all import_react* = __toESM(require_react*()) calls  
    content = content.replace(
      /var import_react(\d*) = __toESM\(require_react[^)]*\(\)[^)]*\);/g,
      'var import_react$1 = __react__;'
    )

    // Replace module.exports = require_react_production() in require_react
    content = content.replace(
      /module\.exports = require_react_production\(\);/g,
      'module.exports = __react__;'
    )

    // Replace all standalone require_react() or require_react_production() calls
    content = content.replace(
      /\brequire_react(?:_production)?\(\)/g,
      '__react__'
    )
  }

  writeFileSync(filePath, content, 'utf-8')
  console.log(`✅ Fixed fs${fixReact ? ' and React' : ''} imports in ${fileName}`)
}

// Fix bundled.js (with React fixes)
const bundledPath = resolve(import.meta.dir, '../dist/bundled.js')
fixFile(bundledPath, 'bundled.js', true)

// Fix semi-bundled.js (without React fixes since React is external)
const semiBundledPath = resolve(import.meta.dir, '../dist/semi-bundled.js')
fixFile(semiBundledPath, 'semi-bundled.js', false)

