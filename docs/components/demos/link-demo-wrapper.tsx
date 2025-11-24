"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { getTerminalHeight } from 'ink-web/utils';

// Must match the rows prop in link-demo.tsx
const ROWS = 10;
const HEIGHT = getTerminalHeight(ROWS);

const LinkDemo = dynamic(() => import('./link-demo'), {
  ssr: false,
  loading: () => <div style={{ height: HEIGHT, background: '#1a1a1a' }} />,
});

export default function LinkDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <LinkDemo />
    </MacWindow>
  );
}
