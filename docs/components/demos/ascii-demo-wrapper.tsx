"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { InkTerminalLoadingPlaceholder } from 'ink-web/utils';

const AsciiDemo = dynamic(() => import('./ascii-demo'), {
  ssr: false,
  loading: () => <InkTerminalLoadingPlaceholder loading="spinner" />,
});

export default function AsciiDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <AsciiDemo />
    </MacWindow>
  );
}
