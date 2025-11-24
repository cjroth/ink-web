"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { InkTerminalLoadingPlaceholder } from 'ink-web/utils';

const GradientDemo = dynamic(() => import('./gradient-demo'), {
  ssr: false,
  loading: () => <InkTerminalLoadingPlaceholder loading="spinner" />,
});

export default function GradientDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <GradientDemo />
    </MacWindow>
  );
}
