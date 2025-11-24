"use client";

import { InkTerminalLoadingPlaceholder } from "ink-web/bundled";
import "ink-web/bundled/css";

export default function LoadingSpinnerDemo() {
  return (
    <InkTerminalLoadingPlaceholder
      rows={8}
      loading={{ type: 'spinner', position: 'center' }}
    />
  );
}
