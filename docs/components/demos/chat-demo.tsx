"use client";

import { useState } from "react";
import { Box } from "ink";
import { InkTerminalBox } from "ink-web";
import "ink-web/css";
import "xterm/css/xterm.css";
import { ChatPanel } from "@/components/ui/chat";
import type { ChatMessage, ToolCallInfo } from "@/components/ui/chat";

const initialMessages: ChatMessage[] = [
  { id: "1", role: "user", content: "Show me my portfolio" },
  {
    id: "2",
    role: "assistant",
    content: "Here's your current portfolio allocation:",
    toolCalls: [
      { id: "tc1", title: "get_portfolio", status: "completed" },
    ],
  },
  { id: "3", role: "user", content: "Calculate rebalancing trades" },
  {
    id: "4",
    role: "assistant",
    content: "I've calculated the optimal trades to rebalance your portfolio. You'll need to sell some US equities and buy international bonds.",
  },
];

let nextId = 5;

export default function ChatDemo({ onReady }: { onReady?: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [activeToolCalls, setActiveToolCalls] = useState<ToolCallInfo[]>([]);

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = { id: String(nextId++), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate tool call
    const toolCallId = `tc-${nextId}`;
    setTimeout(() => {
      setIsLoading(false);
      setActiveToolCalls([{ id: toolCallId, title: "process_request", status: "in_progress" }]);
    }, 500);

    // Complete tool call, start streaming
    setTimeout(() => {
      setActiveToolCalls([{ id: toolCallId, title: "process_request", status: "completed" }]);
    }, 1200);

    // Stream response — batch 3 chars per tick at 50ms to stay under ink's
    // 30 FPS render throttle and avoid full-terminal redraws in xterm.js.
    const response = `You said: "${text}". This is a demo response from the chat panel component.`;
    let charIndex = 0;
    const streamInterval = setInterval(() => {
      charIndex = Math.min(charIndex + 3, response.length);
      if (charIndex < response.length) {
        setStreamingText(response.slice(0, charIndex));
      } else {
        clearInterval(streamInterval);
        setStreamingText("");
        setActiveToolCalls([]);
        setMessages((prev) => [
          ...prev,
          { id: String(nextId++), role: "assistant", content: response },
        ]);
      }
    }, 50);
  };

  return (
    <InkTerminalBox loading={false} onReady={onReady} focus>
      <Box flexDirection="column">
        <ChatPanel
          messages={messages}
          streamingText={streamingText}
          isLoading={isLoading}
          activeToolCalls={activeToolCalls}
          onSendMessage={handleSend}
          placeholder="Ask about your portfolio..."
        />
      </Box>
    </InkTerminalBox>
  );
}
