"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const SpinnerDemo = createDynamicTerminal(
  () => import('./spinner-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function SpinnerDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <SpinnerDemo />
    </MacWindow>
  );
}
