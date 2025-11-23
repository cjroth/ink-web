"use client";

import dynamic from 'next/dynamic';

const SpinnerDemo = dynamic(() => import('./spinner-demo'), {
  ssr: false,
});

export default function SpinnerDemoWrapper() {
  return <SpinnerDemo />;
}
