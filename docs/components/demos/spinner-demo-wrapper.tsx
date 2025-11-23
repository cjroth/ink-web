"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { getTerminalHeight } from 'ink-web/utils';

// Must match the rows prop in spinner-demo.tsx
const ROWS = 10;
const HEIGHT = getTerminalHeight(ROWS);

const SpinnerDemo = dynamic(() => import('./spinner-demo'), {
  ssr: false,
  loading: () => <div style={{ height: HEIGHT, background: '#1a1a1a' }} />,
});

export default function SpinnerDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <SpinnerDemo />
    </MacWindow>
  );
}
