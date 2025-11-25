"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const GradientDemo = createDynamicTerminal(
  () => import('./gradient-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function GradientDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <GradientDemo />
    </MacWindow>
  );
}
