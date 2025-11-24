"use client";

import { InkTerminalLoadingPlaceholder } from "ink-web/bundled";
import "ink-web/bundled/css";

export default function LoadingProgressDemo() {
  return (
    <InkTerminalLoadingPlaceholder
      rows={8}
      loading="progress"
    />
  );
}
