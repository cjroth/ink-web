"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const StatusBarDemo = createDynamicTerminal(
  () => import('./status-bar-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function StatusBarDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <StatusBarDemo />
    </MacWindow>
  );
}
