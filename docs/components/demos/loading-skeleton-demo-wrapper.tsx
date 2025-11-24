"use client";

import dynamic from 'next/dynamic';
import { MacWindow } from "@/components/ui/mac-window";
import { InkTerminalLoadingPlaceholder } from 'ink-web/utils';

const LoadingSkeletonDemo = dynamic(() => import('./loading-skeleton-demo'), {
  ssr: false,
  loading: () => <InkTerminalLoadingPlaceholder rows={8} loading="spinner" />,
});

export default function LoadingSkeletonDemoWrapper() {
  return (
    <MacWindow title="Skeleton">
      <LoadingSkeletonDemo />
    </MacWindow>
  );
}
