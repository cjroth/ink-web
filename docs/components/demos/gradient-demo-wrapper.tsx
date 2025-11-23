"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { getTerminalHeight } from 'ink-web/utils';

// Must match the rows prop in gradient-demo.tsx
const ROWS = 20;
const HEIGHT = getTerminalHeight(ROWS);

const GradientDemo = dynamic(() => import('./gradient-demo'), {
  ssr: false,
  loading: () => <div style={{ height: HEIGHT, background: '#1a1a1a' }} />,
});

export default function GradientDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <GradientDemo />
    </MacWindow>
  );
}
