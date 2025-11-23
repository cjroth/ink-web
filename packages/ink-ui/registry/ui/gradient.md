# Gradient

A gradient color component for Ink that applies beautiful color transitions to terminal text with zero dependencies.

## Features

- 🎨 **13 Built-in Gradients** - Including rainbow, instagram, passion, and more
- 🎯 **Custom Colors** - Create your own gradients with any hex colors
- 📝 **Multiline Support** - Gradients work across multiple lines
- 🚀 **Zero Dependencies** - All gradient calculations done internally
- 🌈 **True Color** - Uses 24-bit RGB for maximum color fidelity
- ⚡ **Performant** - Lightweight and efficient implementation

## Installation

```bash
npx shadcn@latest add https://raw.githubusercontent.com/cjroth/ink-web/main/packages/ink-ui/registry/gradient.json
```

## Usage

### Basic Usage with Built-in Gradient

```tsx
import { Gradient } from '@/components/ui/gradient'
import { Text } from 'ink'

<Gradient name="rainbow">
  <Text bold>🌈 Beautiful Rainbow Text!</Text>
</Gradient>
```

### Custom Colors

```tsx
<Gradient colors={['#ff0000', '#00ff00', '#0000ff']}>
  <Text>Custom RGB Gradient</Text>
</Gradient>
```

### Multiline Text

```tsx
<Gradient name="passion">
  <Text>
    Line 1{'\n'}
    Line 2{'\n'}
    Line 3
  </Text>
</Gradient>
```

## Built-in Gradients

- **rainbow** - Classic rainbow colors (red → yellow → green → cyan → blue → magenta → red)
- **pastel** - Soft pastel colors (light blue → purple)
- **instagram** - Instagram's iconic gradient (purple → pink → orange)
- **retro** - Retro vaporwave colors (9-stop gradient)
- **cristal** - Crystal blue-green (cyan → teal)
- **teen** - Blue, teal, and pink
- **mind** - Purple to teal transition
- **morning** - Red to orange sunrise
- **vice** - Teal to purple
- **passion** - Red to deep purple
- **fruit** - Red to yellow
- **atlas** - Orange, pink, and cyan
- **summer** - Yellow to cyan

## API

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `GradientName` | No* | Name of a built-in gradient |
| `colors` | `string[]` | No* | Array of hex color strings |
| `children` | `ReactNode` | Yes | Content to apply gradient to |

*Either `name` or `colors` must be provided, but not both.

### Types

```typescript
export type GradientName =
  | 'cristal'
  | 'teen'
  | 'mind'
  | 'morning'
  | 'vice'
  | 'passion'
  | 'fruit'
  | 'instagram'
  | 'atlas'
  | 'retro'
  | 'summer'
  | 'pastel'
  | 'rainbow'
```

## Examples

### Header with Gradient

```tsx
<Box flexDirection="column" padding={1}>
  <Gradient name="instagram">
    <Text bold>╔═══════════════════╗</Text>
  </Gradient>
  <Text>  Welcome to My App  </Text>
  <Gradient name="instagram">
    <Text bold>╚═══════════════════╝</Text>
  </Gradient>
</Box>
```

### Multiple Gradients

```tsx
<Box flexDirection="column" gap={1}>
  <Gradient name="passion">
    <Text>❤️  Error: Something went wrong</Text>
  </Gradient>
  
  <Gradient name="cristal">
    <Text>✓ Success: Operation completed</Text>
  </Gradient>
  
  <Gradient name="summer">
    <Text>⚠️  Warning: Check your input</Text>
  </Gradient>
</Box>
```

### Multi-color Custom Gradient

```tsx
<Gradient colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}>
  <Text>Four-color gradient transition</Text>
</Gradient>
```

## How It Works

1. **Color Interpolation**: The gradient component interpolates between colors using linear RGB interpolation
2. **ANSI Escape Codes**: Each character is wrapped with ANSI 24-bit color escape codes
3. **Horizontal Gradients**: Gradients are applied horizontally across each line
4. **ANSI Stripping**: Existing ANSI codes are stripped before applying the gradient

## Notes

- Requires a terminal that supports 24-bit true color (most modern terminals)
- Gradients apply per-line, meaning each line gets the full gradient from start to finish
- Works with any Ink components as children
- The gradient is applied after Ink renders the text, so it works with dynamic content
- Performance is optimized - color calculations are done once per render

## License

MIT