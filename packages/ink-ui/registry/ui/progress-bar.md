# Progress Bar

A flexible progress bar component for Ink that adapts to terminal width with customizable appearance and spacing.

## Features

- 📊 **Adaptive Width** - Automatically adjusts to terminal width
- 🎨 **Customizable Character** - Use any character for the bar (█, =, ▓, etc.)
- 🎯 **Precise Control** - Left/right padding for inline text
- 🌈 **Color Support** - Full Ink color palette support
- 📏 **Width Override** - Set custom column width when needed
- ⚡ **Lightweight** - Zero dependencies beyond Ink
- 🔒 **Type Safe** - Full TypeScript support

## Installation

```bash
npx shadcn@latest add https://raw.githubusercontent.com/cjroth/ink-web/main/packages/ink-ui/registry/progress-bar.json
```

## Usage

### Basic Progress Bar

```tsx
import { ProgressBar } from '@/components/ui/progress-bar'

<ProgressBar percent={0.7} />
```

### With Color

```tsx
<ProgressBar percent={0.5} color="green" />
```

### With Percentage Label

```tsx
import { Box, Text } from 'ink'

<Box>
  <Text>Progress: </Text>
  <ProgressBar percent={progress} left={11} right={6} color="cyan" />
  <Text> {Math.round(progress * 100)}%</Text>
</Box>
```

### Custom Character

```tsx
<ProgressBar percent={0.75} character="=" color="yellow" />
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `percent` | `number` | `0` | Progress percentage (0 to 1) |
| `left` | `number` | `0` | Characters to subtract from left side |
| `right` | `number` | `0` | Characters to subtract from right side |
| `columns` | `number` | `process.stdout.columns \|\| 80` | Terminal width override |
| `character` | `string` | `'█'` | Character to use for the bar |
| `rightPad` | `boolean` | `false` | Pad right side with spaces |
| `color` | `string` | - | Ink color name |
| ...`TextProps` | - | - | All Ink Text props supported |

### Types

```typescript
export interface ProgressBarProps extends Omit<TextProps, 'children'> {
  percent?: number
  left?: number
  right?: number
  columns?: number
  character?: string
  rightPad?: boolean
}
```

## Examples

### Loading Animation

```tsx
import { useState, useEffect } from 'react'
import { Box, Text } from 'ink'

function LoadingBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 1 ? 0 : prev + 0.01))
    }, 50)
    return () => clearInterval(timer)
  }, [])

  return (
    <Box flexDirection="column">
      <Text>Loading...</Text>
      <ProgressBar percent={progress} color="green" />
    </Box>
  )
}
```

### System Monitor

```tsx
<Box flexDirection="column" gap={1}>
  <Box>
    <Text>CPU:  </Text>
    <ProgressBar percent={0.45} left={6} color="cyan" />
  </Box>
  <Box>
    <Text>RAM:  </Text>
    <ProgressBar percent={0.78} left={6} color="yellow" />
  </Box>
  <Box>
    <Text>Disk: </Text>
    <ProgressBar percent={0.23} left={6} color="green" />
  </Box>
</Box>
```

### Different Characters

```tsx
<Box flexDirection="column" gap={1}>
  <ProgressBar percent={0.7} character="█" color="blue" />
  <ProgressBar percent={0.7} character="=" color="green" />
  <ProgressBar percent={0.7} character="▓" color="cyan" />
  <ProgressBar percent={0.7} character="●" color="yellow" />
</Box>
```

### Download Progress

```tsx
function DownloadProgress({ filename, percent, totalSize }) {
  return (
    <Box flexDirection="column">
      <Text>Downloading: <Text bold>{filename}</Text></Text>
      <ProgressBar 
        percent={percent} 
        character="▓"
        color={percent < 1 ? "cyan" : "green"}
        rightPad
      />
      <Text dimColor>
        {Math.round(percent * totalSize)}MB / {totalSize}MB ({Math.round(percent * 100)}%)
      </Text>
    </Box>
  )
}
```

### With Border

```tsx
<Box borderStyle="round" borderColor="cyan" padding={1}>
  <Box flexDirection="column" gap={1}>
    <Text bold color="cyan">Installation Progress</Text>
    <ProgressBar percent={0.65} character="▓" color="cyan" />
    <Text dimColor>Installing dependencies... 65%</Text>
  </Box>
</Box>
```

### Fixed Width

```tsx
<Box flexDirection="column">
  <ProgressBar percent={0.6} columns={40} />
  <ProgressBar percent={0.6} columns={20} />
</Box>
```

### With Right Padding

Right padding ensures the bar always takes up the full width:

```tsx
<Box borderStyle="round" padding={1}>
  <ProgressBar 
    percent={0.4} 
    character="█" 
    color="blue"
    rightPad 
  />
</Box>
```

### Status Indicators

```tsx
function StatusBar({ status, progress }) {
  const color = progress >= 1 ? 'green' : progress >= 0.5 ? 'yellow' : 'red'
  
  return (
    <Box flexDirection="column">
      <Text>Status: <Text color={color}>{status}</Text></Text>
      <ProgressBar percent={progress} color={color} rightPad />
    </Box>
  )
}
```

## How It Works

1. **Width Calculation**: Determines available space from terminal width minus left/right offsets
2. **Percent Clamping**: Ensures percent is between 0 and 1 to prevent overflow
3. **Character Repetition**: Repeats the character based on filled percentage
4. **Optional Padding**: Adds spaces to right side when `rightPad` is enabled
5. **Ink Text Wrapper**: Returns standard Ink Text component with all props

## Calculation Formula

```
screen = columns || process.stdout.columns || 80
space = max(0, screen - right - left)
filled = min(floor(space × percent), space)
bar = character.repeat(filled) + (rightPad ? ' '.repeat(space - filled) : '')
```

## Notes

- Progress is automatically clamped between 0% and 100%
- Use `left` and `right` props to reserve space for inline text
- The `rightPad` prop creates a consistent width regardless of progress
- Supports all Ink `Text` component props (color, bold, dimColor, etc.)
- Terminal width detection works in most environments via `process.stdout.columns`
- Falls back to 80 columns if width cannot be detected
- Works seamlessly with Ink's layout system

## Common Patterns

### Percentage Display
```tsx
<Box>
  <ProgressBar percent={0.75} left={0} right={5} color="green" />
  <Text> 75%</Text>
</Box>
```

### Label Before Bar
```tsx
<Box>
  <Text>Loading: </Text>
  <ProgressBar percent={0.5} left={10} color="cyan" />
</Box>
```

### Multi-step Progress
```tsx
function MultiStepProgress({ step, total }) {
  return (
    <Box flexDirection="column">
      <Text>Step {step} of {total}</Text>
      <ProgressBar percent={step / total} color="blue" />
    </Box>
  )
}
```

## Compatibility

- Works in Node.js CLIs
- Compatible with Ink 4.x+
- Supports modern terminals with ANSI color codes
- Tested with macOS Terminal, iTerm2, Windows Terminal, and VS Code terminal

## License

MIT