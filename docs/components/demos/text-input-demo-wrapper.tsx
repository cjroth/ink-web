"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const TextInputDemo = createDynamicTerminal(
  () => import('./text-input-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function TextInputDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <TextInputDemo />
    </MacWindow>
  );
}
