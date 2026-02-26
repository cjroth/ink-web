"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const TabBarDemo = createDynamicTerminal(
  () => import('./tab-bar-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function TabBarDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <TabBarDemo />
    </MacWindow>
  );
}
