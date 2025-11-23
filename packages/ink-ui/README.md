# ink-ui

UI components for ink-web, installable via shadcn CLI.

## Installation

```bash
npx shadcn@latest add https://raw.githubusercontent.com/cjroth/ink-web/main/packages/ink-ui/registry.json mac-window
```

This will copy the component directly into your project at `components/ui/mac-window.tsx`.

## Components

### MacWindow

A macOS-style window component with traffic light buttons.

```tsx
import { MacWindow } from '@/components/ui/mac-window'

<MacWindow title="Terminal">
  {/* Your content */}
</MacWindow>
```
