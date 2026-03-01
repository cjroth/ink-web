"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const ModalDemo = createDynamicTerminal(
  () => import('./modal-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function ModalDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <ModalDemo />
    </MacWindow>
  );
}
