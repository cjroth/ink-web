# Ink Web

**Render Ink in the browser via Xterm.js** - bringing terminal UI to the web.

[![npm version](https://img.shields.io/npm/v/ink-web.svg)](https://www.npmjs.com/package/ink-web)
[![License](https://img.shields.io/npm/l/ink-web.svg)](LICENSE)

## Overview

Ink Web enables you to run [Ink v5](https://github.com/vadimdemedes/ink) applications directly in the browser using [Xterm.js](https://xtermjs.org/), without Node.js.

- ✅ **Run Ink apps in the browser** - No Node.js required
- ✅ **Minimal shims** - Lightweight Node module shims for browser compatibility
- ✅ **Full Ink support** - Works with Ink v5 and its ecosystem
- ✅ **Modern tooling** - Built with Vite, Bun, and TypeScript

## 📚 Documentation

**[View the full documentation →](https://your-docs-url.dev)**

- [Getting Started](https://your-docs-url.dev/installation)
- [Quick Start Guide](https://your-docs-url.dev/quick-start)
- [Examples](https://your-docs-url.dev/examples) (Snake game, Dino runner, Side scroller)
- [API Reference](https://your-docs-url.dev/api)

## Quick Start

### Installation

```bash
bun add ink-web ink react xterm @xterm/addon-fit
```

### Usage

```typescript
import React from 'react'
import { Text } from 'ink'
import { mountInkInXterm } from 'ink-web'
import 'xterm/css/xterm.css'

const App = () => <Text color="green">Hello from Ink Web!</Text>

const container = document.getElementById('terminal')!
mountInkInXterm(<App />, { container, focus: true })
```

## Examples

This repository includes several interactive examples:

- **🐍 Snake Game** - Classic snake with arrow key controls
- **🦖 Dino Runner** - Chrome's offline dino game
- **🏃 Side Scroller** - Platform game with physics

Run examples:

```bash
cd snake && bun run dev
cd dino-runner && bun run dev
cd side-scroller && bun run dev
```

## Development

### Run Documentation Site

```bash
bun run docs:dev
```

### Run Tests

```bash
bun test
```

### Build

```bash
bun run build
```

## How It Works

Ink Web bridges Node.js and the browser by:

1. Rendering Ink components into an Xterm.js terminal instance
2. Providing minimal shims for Node.js modules (process, stream, fs, tty, etc.)
3. Capturing keyboard input and forwarding to Ink
4. Handling ANSI output through Xterm.js

## Contributing

Contributions are welcome! Please check out our [contributing guidelines](CONTRIBUTING.md).

## License

MIT © [Your Name]

## Acknowledgments

- [Ink](https://github.com/vadimdemedes/ink) - React for CLIs
- [Xterm.js](https://xtermjs.org/) - Terminal emulator for the web


