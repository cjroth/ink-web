"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { InkTerminalLoadingPlaceholder } from 'ink-web/utils';

const LoadingSpinnerDemo = dynamic(() => import('./loading-spinner-demo'), {
  ssr: false,
  loading: () => <InkTerminalLoadingPlaceholder rows={8} loading="spinner" />,
});

export default function LoadingSpinnerDemoWrapper() {
  return (
    <MacWindow title="Spinner">
      <LoadingSpinnerDemo />
    </MacWindow>
  );
}
