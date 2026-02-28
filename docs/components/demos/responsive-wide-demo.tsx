"use client";

import { Box, Text } from "ink";
import { InkTerminalBox } from "ink-web";
import "ink-web/css";
import "xterm/css/xterm.css";

function Panel({ title, children, width = 40 }: { title: string; children: React.ReactNode; width?: number }) {
  return (
    <Box flexDirection="column" borderStyle="round" paddingX={2} paddingY={1} width={width}>
      <Text bold color="cyan">{title}</Text>
      <Text> </Text>
      {children}
    </Box>
  );
}

export default function ResponsiveWideDemo({ onReady }: { onReady?: () => void }) {
  return (
    <InkTerminalBox loading={false} onReady={onReady}>
      <Box flexDirection="row" gap={1} padding={2}>
        <Panel title="System Status">
          <Text><Text color="green">●</Text> CPU: 42%</Text>
          <Text><Text color="green">●</Text> Memory: 3.2 / 8 GB</Text>
          <Text><Text color="yellow">●</Text> Disk: 78% used</Text>
          <Text><Text color="green">●</Text> Network: 120 Mbps</Text>
        </Panel>

        <Panel title="Active Services">
          <Text><Text color="green">running</Text>  nginx</Text>
          <Text><Text color="green">running</Text>  postgres</Text>
          <Text><Text color="yellow">starting</Text> redis</Text>
          <Text><Text color="red">stopped</Text>  cron</Text>
        </Panel>

        <Panel title="Recent Events">
          <Text dimColor>12:01</Text>
          <Text>  Deploy completed</Text>
          <Text dimColor>11:45</Text>
          <Text>  Config updated</Text>
          <Text dimColor>11:30</Text>
          <Text>  Backup finished</Text>
        </Panel>
      </Box>
    </InkTerminalBox>
  );
}
