# @ink-web/browser

Run [Ink](https://github.com/vadimdemedes/ink) (React for CLIs) in the browser using [Xterm.js](https://xtermjs.org/).

## Features

- 🖥️ Renders Ink components inside Xterm.js in the browser
- 🚫 No Node.js required - uses minimal shims for Node-only modules
- 📦 Bundled and ready to use

## Installation

```bash
npm install @ink-web/browser react xterm
# or
bun add @ink-web/browser react xterm
```

## Usage

There are **two ways** to use `@ink-web/browser`, depending on your needs:

### Option A: Bundled Version (Recommended for Simplicity)

**Best for:** Most users who want less configuration and encapsulated dependencies.

**Advantages:**
- ✅ Minimal or no Vite plugin configuration (Vite auto-polyfills most node built-ins)
- ✅ Shims are largely encapsulated and won't interfere with other code
- ✅ Single import for both ink and the wrapper

**Disadvantages:**
- ❌ Larger bundle size (~1MB for ink + dependencies)
- ❌ If you use ink/chalk elsewhere, they get duplicated
- ❌ May require minimal Vite config for production builds (see below)

**Installation:**

```bash
npm install @ink-web/browser react xterm
```

**Usage:**

```typescript
import { InkXterm, Box, Text } from '@ink-web/browser/bundled'
import 'xterm/css/xterm.css'

const App = () => (
  <InkXterm focus>
    <Box flexDirection="column">
      <Text color="green">Hello from Ink in the browser!</Text>
    </Box>
  </InkXterm>
)
```

**Note for Production Builds:** If you encounter build errors about unresolved modules, add this minimal config:

```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      stream: 'stream-browserify',
      buffer: 'buffer',
      process: 'process/browser',
      events: 'events',
    },
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
```

Then install: `npm install stream-browserify buffer process events`

---

### Option B: Plugin-Based (Smaller Bundle)

**Best for:** Advanced users who want smaller bundles or already use ink/chalk in their app.

**Advantages:**
- ✅ Smaller package bundle size (~5KB)
- ✅ No duplication if you use ink/chalk elsewhere
- ✅ More control over versions

**Disadvantages:**
- ❌ Requires Vite plugin configuration
- ❌ Shims are global to your entire build (may affect other code)

**Installation:**

```bash
npm install @ink-web/browser ink react xterm
```

**Vite Configuration:**

```typescript
import { inkBrowserPlugin } from '@ink-web/browser/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), inkBrowserPlugin()],
})
```

The plugin automatically:
- Sets up all required module aliases for browser shims
- Configures build targets for ES2020+ (needed for top-level await support)
- Defines global variables (`process.env`, `process.cwd`)

**Usage:**

```typescript
import { InkXterm } from '@ink-web/browser'
import { Box, Text } from 'ink'
import 'xterm/css/xterm.css'

const App = () => (
  <InkXterm focus>
    <Box flexDirection="column">
      <Text color="green">Hello from Ink!</Text>
    </Box>
  </InkXterm>
)
```

Note: Import ink components from `ink` separately.

---

## Examples

### 3. Use in Your App

**Imperative API:**

```typescript
import { mountInkInXterm } from '@ink-web/browser'
import { Box, Text } from 'ink'
import React from 'react'
import 'xterm/css/xterm.css'

const App = () => (
  <Box flexDirection="column">
    <Text color="green">Hello from Ink in the browser!</Text>
    <Text>Type something...</Text>
  </Box>
)

const container = document.getElementById('terminal')!
const { term, unmount } = mountInkInXterm(<App />, { 
  container,
  focus: true 
})

// Clean up when done
await unmount()
```

**React Component API:**

```typescript
import { InkXterm } from '@ink-web/browser'
import { Box, Text } from 'ink'
import React from 'react'
import 'xterm/css/xterm.css'

const App = () => (
  <Box flexDirection="column">
    <Text color="green">Hello from Ink!</Text>
  </Box>
)

const MyTerminal = () => (
  <InkXterm className="terminal-container" focus>
    <App />
  </InkXterm>
)
```

**HTML:**

Don't forget to include a container element:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Ink in Browser</title>
  </head>
  <body>
    <div id="terminal" style="width: 100vw; height: 100vh"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Development

### Run Demo

```bash
cd ink-browser
bun install
bun dev
```

Then open http://localhost:5175

### Build Package

```bash
bun run build
```

### Run Tests

```bash
bun test
```

## How It Works

This library provides browser-compatible shims for Node.js modules that Ink depends on (like `process`, `stream`, `tty`, etc.), allowing Ink to run in a browser environment.

The shims are minimal implementations that provide just enough functionality for Ink to render correctly in Xterm.js. When you configure Vite to alias Node.js modules to these shims, Ink can run without modification.

## API

### `mountInkInXterm(element, options)`

Mounts an Ink component into an Xterm.js terminal.

**Parameters:**
- `element: React.ReactElement` - The Ink component to render
- `options: InkBrowserOptions`
  - `container: HTMLElement` - The DOM element to mount the terminal in
  - `focus?: boolean` - Whether to focus the terminal (default: true)
  - `termOptions?: ITerminalOptions` - Xterm.js terminal options

**Returns:**
```typescript
{
  term: Terminal       // The Xterm.js terminal instance
  unmount: () => Promise<void>  // Function to clean up and unmount
}
```

### `<InkXterm>`

React component wrapper for mounting Ink in Xterm.

**Props:**
- `children: React.ReactElement` - The Ink component to render
- `className?: string` - CSS class for the container
- `focus?: boolean` - Whether to focus the terminal
- `termOptions?: ITerminalOptions` - Xterm.js terminal options

## Compatibility

- **React:** 19.x+
- **Ink:** 6.x+
- **Node.js:** 18.0.0+
- **Vite:** 7.0.0+ (for plugin-based approach)
- **Xterm.js:** 5.0.0+

## License

MIT


