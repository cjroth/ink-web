"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { getTerminalHeight } from 'ink-web/utils';

// Must match the rows prop in multi-select-demo.tsx
const ROWS = 14;
const HEIGHT = getTerminalHeight(ROWS);

const MultiSelectDemo = dynamic(() => import('./multi-select-demo'), {
  ssr: false,
  loading: () => <div style={{ height: HEIGHT, background: '#1a1a1a' }} />,
});

export default function MultiSelectDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <MultiSelectDemo />
    </MacWindow>
  );
}
