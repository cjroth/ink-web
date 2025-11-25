"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const DividerDemo = createDynamicTerminal(
  () => import('./divider-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function DividerDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <DividerDemo />
    </MacWindow>
  );
}
