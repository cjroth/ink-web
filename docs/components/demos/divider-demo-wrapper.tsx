"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { getTerminalHeight } from 'ink-web/utils';

const ROWS = 12;
const HEIGHT = getTerminalHeight(ROWS);

const DividerDemo = dynamic(() => import('./divider-demo'), {
  ssr: false,
  loading: () => <div style={{ height: HEIGHT, background: '#1a1a1a' }} />,
});

export default function DividerDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <DividerDemo />
    </MacWindow>
  );
}
