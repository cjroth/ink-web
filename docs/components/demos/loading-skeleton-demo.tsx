"use client";

import { InkTerminalLoadingPlaceholder } from "ink-web";
import "ink-web/css";

export default function LoadingSkeletonDemo() {
  return (
    <InkTerminalLoadingPlaceholder
      rows={8}
      loading={{ type: "skeleton", position: "top-left" }}
    />
  );
}
