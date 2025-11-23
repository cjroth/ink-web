"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { getTerminalHeight } from 'ink-web/utils';

// Must match the rows prop in select-input-demo.tsx
const ROWS = 12;
const HEIGHT = getTerminalHeight(ROWS);

const SelectInputDemo = dynamic(() => import('./select-input-demo'), {
  ssr: false,
  loading: () => <div style={{ height: HEIGHT, background: '#1a1a1a' }} />,
});

export default function SelectInputDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <SelectInputDemo />
    </MacWindow>
  );
}
