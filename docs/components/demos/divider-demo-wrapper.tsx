"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { InkTerminalLoadingPlaceholder } from 'ink-web/utils';

const DividerDemo = dynamic(() => import('./divider-demo'), {
  ssr: false,
  loading: () => <InkTerminalLoadingPlaceholder loading="spinner" />,
});

export default function DividerDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <DividerDemo />
    </MacWindow>
  );
}
