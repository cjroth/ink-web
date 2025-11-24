"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { InkTerminalLoadingPlaceholder } from 'ink-web/utils';

const LoadingProgressDemo = dynamic(() => import('./loading-progress-demo'), {
  ssr: false,
  loading: () => <InkTerminalLoadingPlaceholder rows={8} loading="spinner" />,
});

export default function LoadingProgressDemoWrapper() {
  return (
    <MacWindow title="Progress">
      <LoadingProgressDemo />
    </MacWindow>
  );
}
