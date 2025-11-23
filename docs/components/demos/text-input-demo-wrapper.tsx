"use client";

import dynamic from 'next/dynamic';

const TextInputDemo = dynamic(() => import('./text-input-demo'), {
  ssr: false,
});

export default function TextInputDemoWrapper() {
  return <TextInputDemo />;
}
