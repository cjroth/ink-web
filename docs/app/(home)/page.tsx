'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const InkDemo = dynamic(() => import('../components/InkDemo').then(mod => ({ default: mod.InkDemo })), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-muted animate-pulse rounded-lg" />,
});

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center text-center flex-1 gap-8 p-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">ink-web</h1>
        <p className="text-lg text-muted-foreground mb-2">
          Run Ink (React for CLIs) in the browser using Xterm.js
        </p>
        <p>
          <Link href="/docs" className="font-medium underline">
            View Documentation
          </Link>
        </p>
      </div>
      <div className="w-full max-w-3xl">
        <InkDemo />
      </div>
    </div>
  );
}
