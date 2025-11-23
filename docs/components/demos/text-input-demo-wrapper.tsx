"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { getTerminalHeight } from 'ink-web/utils';

// Must match the rows prop in text-input-demo.tsx
const ROWS = 10;
const HEIGHT = getTerminalHeight(ROWS);

const TextInputDemo = dynamic(() => import('./text-input-demo'), {
  ssr: false,
  loading: () => <div style={{ height: HEIGHT, background: '#1a1a1a' }} />,
});

export default function TextInputDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <TextInputDemo />
    </MacWindow>
  );
}
