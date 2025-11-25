"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const TableDemo = createDynamicTerminal(
  () => import('./table-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function TableDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <TableDemo />
    </MacWindow>
  );
}
