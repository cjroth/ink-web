"use client";

import { useState } from "react";
import { Box, Text, useInput } from "ink";
import { InkTerminalBox } from "ink-web";
import "ink-web/css";
import "xterm/css/xterm.css";
import { TabBar } from "@/components/ui/tab-bar";

const tabs = ["Files", "Search", "Git", "Debug"];

function TabBarApp() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((_input, key) => {
    if (key.leftArrow) {
      setSelectedIndex((i) => (i > 0 ? i - 1 : tabs.length - 1));
    }
    if (key.rightArrow) {
      setSelectedIndex((i) => (i < tabs.length - 1 ? i + 1 : 0));
    }
  });

  return (
    <Box flexDirection="column" gap={1}>
      <TabBar label="View" options={tabs} selectedIndex={selectedIndex} />
      <Text dimColor>Use ←/→ arrow keys to switch tabs</Text>
    </Box>
  );
}

export default function TabBarDemo({ onReady }: { onReady?: () => void }) {
  return (
    <InkTerminalBox loading={false} onReady={onReady}>
      <TabBarApp />
    </InkTerminalBox>
  );
}
