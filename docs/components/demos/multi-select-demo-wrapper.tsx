"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { InkTerminalLoadingPlaceholder } from 'ink-web/utils';

const MultiSelectDemo = dynamic(() => import('./multi-select-demo'), {
  ssr: false,
  loading: () => <InkTerminalLoadingPlaceholder loading="spinner" />,
});

export default function MultiSelectDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <MultiSelectDemo />
    </MacWindow>
  );
}
