"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { InkTerminalLoadingPlaceholder } from 'ink-web/utils';

const TableDemo = dynamic(() => import('./table-demo'), {
  ssr: false,
  loading: () => <InkTerminalLoadingPlaceholder loading="spinner" />,
});

export default function TableDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <TableDemo />
    </MacWindow>
  );
}
