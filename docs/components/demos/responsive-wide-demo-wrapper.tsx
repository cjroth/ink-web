"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const ResponsiveWideDemo = createDynamicTerminal(
  () => import('./responsive-wide-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function ResponsiveWideDemoWrapper() {
  return (
    <MacWindow title="Dashboard" minWidth={900}>
      <ResponsiveWideDemo />
    </MacWindow>
  );
}
