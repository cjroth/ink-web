"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { InkTerminalLoadingPlaceholder } from 'ink-web/utils';

const SpinnerDemo = dynamic(() => import('./spinner-demo'), {
  ssr: false,
  loading: () => <InkTerminalLoadingPlaceholder loading="spinner" />,
});

export default function SpinnerDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <SpinnerDemo />
    </MacWindow>
  );
}
