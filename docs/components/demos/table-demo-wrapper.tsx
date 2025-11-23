"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { getTerminalHeight } from 'ink-web/utils';

// Must match the rows prop in table-demo.tsx
const ROWS = 12;
const HEIGHT = getTerminalHeight(ROWS);

const TableDemo = dynamic(() => import('./table-demo'), {
  ssr: false,
  loading: () => <div style={{ height: HEIGHT, background: '#1a1a1a' }} />,
});

export default function TableDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <TableDemo />
    </MacWindow>
  );
}
