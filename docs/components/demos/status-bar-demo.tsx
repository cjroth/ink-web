"use client";

import { useState } from "react";
import { Box, Text, useInput } from "ink";
import { InkTerminalBox } from "ink-web";
import "ink-web/css";
import "xterm/css/xterm.css";
import { StatusBar } from "@/components/ui/status-bar";

const shortcuts = [
  { key: "⏎/q", label: "exit" },
  { key: "Tab", label: "switch focus" },
  { key: "←→", label: "cycle" },
  { key: "b", label: "back" },
  { key: "z", label: "reset" },
];

function StatusBarApp() {
  const [lastKey, setLastKey] = useState<string | null>(null);

  useInput((input, key) => {
    if (key.return || input === "q") {
      setLastKey("exit (⏎/q)");
    } else if (key.tab) {
      setLastKey("switch focus (Tab)");
    } else if (key.leftArrow) {
      setLastKey("cycle (←)");
    } else if (key.rightArrow) {
      setLastKey("cycle (→)");
    } else if (input === "b") {
      setLastKey("back (b)");
    } else if (input === "z") {
      setLastKey("reset (z)");
    }
  });

  return (
    <Box flexDirection="column" gap={1}>
      {lastKey ? (
        <Text>
          Pressed: <Text bold color="cyan">{lastKey}</Text>
        </Text>
      ) : (
        <Text dimColor>Press a key to trigger an action</Text>
      )}
      <StatusBar
        items={shortcuts}
        extra={<Text color="green">● Ready</Text>}
      />
    </Box>
  );
}

export default function StatusBarDemo({ onReady }: { onReady?: () => void }) {
  return (
    <InkTerminalBox loading={false} onReady={onReady}>
      <StatusBarApp />
    </InkTerminalBox>
  );
}
