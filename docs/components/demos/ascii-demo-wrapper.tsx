"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const AsciiDemo = createDynamicTerminal(
  () => import('./ascii-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function AsciiDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <AsciiDemo />
    </MacWindow>
  );
}
