"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const LinkDemo = createDynamicTerminal(
  () => import('./link-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function LinkDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <LinkDemo />
    </MacWindow>
  );
}
