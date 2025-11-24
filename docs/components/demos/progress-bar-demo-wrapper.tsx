"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { getTerminalHeight } from 'ink-web/utils';

// Must match the rows prop in progress-bar-demo.tsx
const ROWS = 10;
const HEIGHT = getTerminalHeight(ROWS);

const ProgressBarDemo = dynamic(() => import('./progress-bar-demo'), {
  ssr: false,
  loading: () => <div style={{ height: HEIGHT, background: '#1a1a1a' }} />,
});

export default function ProgressBarDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <ProgressBarDemo />
    </MacWindow>
  );
}
