"use client";

import { createDynamicTerminal } from 'ink-web/next';
import { MacWindow } from "@/components/ui/mac-window";

const ChatDemo = createDynamicTerminal(
  () => import('./chat-demo').then(m => m.default),
  {
    loading: 'spinner'
  }
);

export default function ChatDemoWrapper() {
  return (
    <MacWindow title="Terminal">
      <ChatDemo />
    </MacWindow>
  );
}
