# ink-ui

UI components for ink-web, installable via shadcn CLI.

## Installation

Install components directly into your project using the shadcn CLI:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/cjroth/ink-web/main/packages/ink-ui/registry.json <component-name>
```

For example, to add the `mac-window` component:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/cjroth/ink-web/main/packages/ink-ui/registry.json mac-window
```

This copies the component source directly into your project at `components/ui/<component-name>.tsx`.

## Available Components

| Component | Description |
|-----------|-------------|
| `ascii` | Render text as ASCII art using figlet fonts |
| `divider` | A horizontal divider with optional centered title text |
| `gradient` | Color gradients for terminal text with built-in presets |
| `link` | Clickable terminal links using OSC 8 escape sequences |
| `mac-window` | A macOS-style window component with traffic light buttons |
| `multi-select` | Multi-select input with keyboard navigation |
| `progress-bar` | Flexible progress bar with customizable appearance |
| `select-input` | Select input with keyboard navigation |
| `spinner` | Animated loading spinner with customizable text |
| `table` | Table component for displaying tabular data |
| `text-input` | Text input with cursor and placeholder support |

## Project Structure

```
packages/ink-ui/
├── components/           # Source of truth for all components
│   ├── ascii/
│   │   ├── ascii.tsx
│   │   └── ascii.test.tsx
│   ├── gradient/
│   │   ├── gradient.tsx
│   │   └── gradient.test.tsx
│   └── ...
├── registry/             # Generated registry files (do not edit)
│   ├── ascii.json
│   ├── gradient.json
│   └── ui/
│       ├── ascii.tsx
│       └── ...
├── scripts/
│   └── build-registry.ts # Script to generate registry from components
├── registry.json         # Generated registry index
└── package.json
```

## Development

### Adding a New Component

1. Create a new folder under `components/` with your component name:
   ```
   components/my-component/
   ├── my-component.tsx
   └── my-component.test.tsx  # optional
   ```

2. Add the component metadata to `scripts/build-registry.ts`:
   ```typescript
   const COMPONENT_CONFIGS: Record<string, ComponentConfig> = {
     // ... existing components
     'my-component': {
       name: 'my-component',
       title: 'My Component',
       description: 'Description of what the component does',
       dependencies: ['some-npm-package'],      // optional
       devDependencies: ['@types/some-package'], // optional
     },
   }
   ```

3. Build the registry:
   ```bash
   bun run build
   ```

### Building the Registry

From the `packages/ink-ui` directory:
```bash
bun run build
```

Or from the repository root:
```bash
bun run build:registry
```

This reads all component source files and generates:
- `registry.json` - The main registry index
- `registry/<component>.json` - Individual component registry files with embedded source
- `registry/ui/<component>.tsx` - Component source files for reference

### Running Tests

From the `packages/ink-ui` directory:
```bash
bun test
```

Or from the repository root:
```bash
bun run test:ui
```

## Usage Examples

### MacWindow

```tsx
import { MacWindow } from '@/components/ui/mac-window'

<MacWindow title="Terminal">
  {/* Your terminal content */}
</MacWindow>
```

### Gradient

```tsx
import { Gradient } from '@/components/ui/gradient'
import { Text } from 'ink-web/bundled'

// Using a preset
<Gradient name="rainbow">
  <Text>Rainbow text!</Text>
</Gradient>

// Using custom colors
<Gradient colors={['#ff0000', '#00ff00', '#0000ff']}>
  <Text>Custom gradient</Text>
</Gradient>
```

### ProgressBar

```tsx
import { ProgressBar } from '@/components/ui/progress-bar'

<ProgressBar percent={0.75} color="green" />
```

### SelectInput

```tsx
import { SelectInput } from '@/components/ui/select-input'

const items = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
]

<SelectInput
  items={items}
  onSelect={(item) => console.log(item.value)}
/>
```

### Spinner

```tsx
import { Spinner } from '@/components/ui/spinner'

<Spinner text="Loading..." color="cyan" />
```

## License

MIT
