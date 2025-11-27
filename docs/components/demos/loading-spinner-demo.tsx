"use client";

import { InkTerminalLoadingPlaceholder } from "ink-web";
import "ink-web/css";

export default function LoadingSpinnerDemo() {
  return (
    <InkTerminalLoadingPlaceholder
      rows={8}
      loading={{ type: 'spinner', position: 'center' }}
    />
  );
}
