"use client";

import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { useEffect, useState } from "react";
import { MacWindow } from "@/components/ui/mac-window";
import { Box, Text, InkTerminalBox } from "ink-web/bundled";
import { useTextInput } from "@/components/ui/text-input";

function TextInputApp() {
  const { value, history } = useTextInput();

  return (
    <Box flexDirection="column">
      <Text color="green">TextInput Demo</Text>
      <Text dimColor>Type something and press Enter...</Text>
      <Text> </Text>
      {history.length > 0 && (
        <Box flexDirection="column">
          <Text bold>History:</Text>
          {history.map((item, i) => (
            <Text key={i}> {item}</Text>
          ))}
          <Text> </Text>
        </Box>
      )}
      <Box>
        <Text color="cyan">&gt; </Text>
        <Text>{value}</Text>
        <Text inverse> </Text>
      </Box>
    </Box>
  );
}

export default function TextInputDemo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-48 bg-muted animate-pulse rounded-lg" />;
  }

  return (
    <MacWindow title="Terminal">
      <InkTerminalBox focus>
        <TextInputApp />
      </InkTerminalBox>
    </MacWindow>
  );
}
