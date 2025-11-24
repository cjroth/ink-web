"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { InkTerminalLoadingPlaceholder } from 'ink-web/utils';

const LinkDemo = dynamic(() => import('./link-demo'), {
  ssr: false,
  loading: () => <InkTerminalLoadingPlaceholder loading="spinner" />,
});

export default function LinkDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <LinkDemo />
    </MacWindow>
  );
}
