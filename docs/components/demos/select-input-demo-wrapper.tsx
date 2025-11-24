"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { InkTerminalLoadingPlaceholder } from 'ink-web/utils';

const SelectInputDemo = dynamic(() => import('./select-input-demo'), {
  ssr: false,
  loading: () => <InkTerminalLoadingPlaceholder loading="spinner" />,
});

export default function SelectInputDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <SelectInputDemo />
    </MacWindow>
  );
}
