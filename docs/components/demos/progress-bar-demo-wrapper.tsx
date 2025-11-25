"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const ProgressBarDemo = createDynamicTerminal(
  () => import('./progress-bar-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function ProgressBarDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <ProgressBarDemo />
    </MacWindow>
  );
}
