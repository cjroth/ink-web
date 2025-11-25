"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const MultiSelectDemo = createDynamicTerminal(
  () => import('./multi-select-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function MultiSelectDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <MultiSelectDemo />
    </MacWindow>
  );
}
