# @ink-web/browser

Run [Ink](https://github.com/vadimdemedes/ink) (React for CLIs) in the browser using [Xterm.js](https://xtermjs.org/).

## Features

- 🖥️ Renders Ink components inside Xterm.js in the browser
- 🚫 No Node.js required - uses minimal shims for Node-only modules
- 📦 Bundled and ready to use

## Installation

```bash
npm install @ink-web/browser ink react xterm
# or
bun add @ink-web/browser ink react xterm
```

## Usage

### 1. Install Dependencies

```bash
npm install @ink-web/browser ink react xterm path-browserify
```

### 2. Configure Vite

Use the included Vite plugin to automatically configure all necessary settings:

**vite.config.ts:**

```typescript
import { inkBrowserPlugin } from '@ink-web/browser/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), inkBrowserPlugin()],
})
```

> **Note:** The plugin is exported as a separate entry point (`@ink-web/browser/vite`) to avoid loading browser-specific dependencies (like `xterm`) during Vite config evaluation.

The plugin automatically:
- Sets up all required module aliases for browser shims
- Configures build targets for ES2020+ (needed for top-level await support)
- Defines global variables (`process.env`, `process.cwd`)

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

- **React:** 18.x only
- **Ink:** 5.x only  
- **Node.js:** 18.0.0+
- **Vite:** 4.0.0+
- **Xterm.js:** 5.0.0+

React 19 and Ink 6 support is planned for a future release.

## License

MIT


