"use client";

import { useState } from "react";
import { Box, Text, useInput } from "ink";
import { InkTerminalBox } from "ink-web";
import "ink-web/css";
import "xterm/css/xterm.css";
import { StatusBar } from "@/components/ui/status-bar";

const shortcuts = [
  { key: "s", label: "Save" },
  { key: "o", label: "Open" },
  { key: "q", label: "Quit" },
];

function StatusBarApp() {
  const [lastKey, setLastKey] = useState<string | null>(null);

  useInput((input) => {
    const match = shortcuts.find((s) => s.key === input);
    if (match) {
      setLastKey(`${match.label} (${match.key})`);
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
