"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { InkTerminalLoadingPlaceholder } from 'ink-web/utils';

const ProgressBarDemo = dynamic(() => import('./progress-bar-demo'), {
  ssr: false,
  loading: () => <InkTerminalLoadingPlaceholder loading="spinner" />,
});

export default function ProgressBarDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <ProgressBarDemo />
    </MacWindow>
  );
}
