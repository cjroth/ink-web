"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { getTerminalHeight } from 'ink-web/utils';

const ROWS = 10;
const HEIGHT = getTerminalHeight(ROWS);

const AsciiDemo = dynamic(() => import('./ascii-demo'), {
  ssr: false,
  loading: () => <div style={{ height: HEIGHT, background: '#1a1a1a' }} />,
});

export default function AsciiDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <AsciiDemo />
    </MacWindow>
  );
}
