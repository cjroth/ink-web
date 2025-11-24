"use client";

import { InkTerminalLoadingPlaceholder } from "ink-web/bundled";
import "ink-web/bundled/css";

export default function LoadingSkeletonDemo() {
  return (
    <InkTerminalLoadingPlaceholder
      rows={8}
      loading={{ type: "skeleton", position: "top-left" }}
    />
  );
}
