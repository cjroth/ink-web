# Ink Web

Build interactive terminal UIs with [Ink](https://github.com/vadimdemedes/ink) and React that run in the browser and the terminal.

**[Documentation](https://ink-web.dev)**

## Packages

This monorepo contains two packages:

### `ink-web` (npm)

A drop-in browser runtime for Ink. It renders Ink components into an xterm.js terminal in the browser.

```bash
npm install ink-web
```

Your components import from `ink` as normal — a bundler alias redirects to `ink-web` at build time:

```tsx
import { Box, Text } from "ink";
import { InkXterm } from "ink-web";
import "ink-web/css";

export default function App() {
  return (
    <InkXterm focus>
      <Box flexDirection="column">
        <Text bold color="green">Hello from the browser!</Text>
      </Box>
    </InkXterm>
  );
}
```

Configure the alias in your bundler:

```js
// next.config.mjs (Turbopack)
{ turbopack: { resolveAlias: { ink: "ink-web" } } }

// vite.config.ts
{ resolve: { alias: { ink: "ink-web" } } }
```

Exports: `ink-web`, `ink-web/css`, `ink-web/core`, `ink-web/next`, `ink-web/vite`, `ink-web/utils`

### `ink-ui` (shadcn registry)

A collection of terminal UI components installable via the [shadcn CLI](https://ui.shadcn.com/docs/cli). Components are served from raw GitHub URLs — there is no npm package.

```bash
npx shadcn@latest add https://raw.githubusercontent.com/cjroth/ink-web/main/packages/ink-ui/registry/table.json
```

This copies the component source into your `components/ui/` folder. Available components:

| Component | Description |
|-----------|-------------|
| `ascii` | Render text as ASCII art using figlet fonts |
| `gradient` | Apply color gradients to terminal text |
| `link` | Clickable terminal hyperlinks |
| `multi-select` | Multi-select input with keyboard navigation |
| `select-input` | Single-select input with keyboard navigation |
| `spinner` | Animated loading spinner |
| `status-bar` | Keybinding hints bar with inverse-bold key badges |
| `tab-bar` | Horizontal tab bar with inverse highlight |
| `table` | Table with rounded borders, alignment, per-cell styling, and footer rows |
| `text-input` | Text input with cursor, placeholder, and history |

## Development

```bash
# Install dependencies
bun install

# Run ink-web tests
cd packages/ink-web && bun test

# Run ink-ui tests
cd packages/ink-ui && bun test

# Rebuild the shadcn registry (after changing ink-ui components)
cd packages/ink-ui && bun run build

# Run the docs site
cd packages/ink-web && bun run docs
```

### Project structure

```
packages/
  ink-web/          # npm package — browser runtime for Ink
    src/            # InkXterm, shims, vite plugin, Next.js helpers
    docs/           # Documentation site (ink-web.dev)
      components/
        ui/         # Copies of ink-ui components used by the docs site
        demos/      # Live demo components embedded in doc pages
  ink-ui/           # shadcn registry — terminal UI components
    components/     # Component source (one directory per component)
    registry/       # Generated registry JSON + source copies (via bun run build)
    scripts/        # Build script for generating registry files
```

### Adding/updating ink-ui components

1. Edit the component in `packages/ink-ui/components/<name>/<name>.tsx`
2. Run `bun run build` in `packages/ink-ui` to regenerate the registry
3. Copy the updated source to `docs/components/ui/<name>.tsx` so the docs site stays in sync

## License

[MIT](https://opensource.org/licenses/MIT)
