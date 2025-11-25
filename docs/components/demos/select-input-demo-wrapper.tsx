"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const SelectInputDemo = createDynamicTerminal(
  () => import('./select-input-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function SelectInputDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <SelectInputDemo />
    </MacWindow>
  );
}
