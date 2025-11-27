"use client";

import "ink-web/css";
import "xterm/css/xterm.css";
import { Box, Text } from "ink";
import { InkTerminalBox } from "ink-web";
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

export default function TextInputDemo({ onReady }: { onReady?: () => void }) {
  return (
    <InkTerminalBox focus loading={false} onReady={onReady}>
      <TextInputApp />
    </InkTerminalBox>
  );
}
