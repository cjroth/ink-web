"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const ResponsiveFlexDemo = createDynamicTerminal(
  () => import('./responsive-flex-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function ResponsiveFlexDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <ResponsiveFlexDemo />
    </MacWindow>
  );
}
