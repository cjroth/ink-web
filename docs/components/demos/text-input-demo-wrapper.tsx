"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { InkTerminalLoadingPlaceholder } from 'ink-web/utils';

const TextInputDemo = dynamic(() => import('./text-input-demo'), {
  ssr: false,
  loading: () => <InkTerminalLoadingPlaceholder loading="spinner" />,
});

export default function TextInputDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <TextInputDemo />
    </MacWindow>
  );
}
