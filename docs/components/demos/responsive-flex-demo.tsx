"use client";

import { Box, Text } from "ink";
import { InkTerminalBox } from "ink-web";
import "ink-web/css";
import "xterm/css/xterm.css";

export default function ResponsiveFlexDemo({ onReady }: { onReady?: () => void }) {
  return (
    <InkTerminalBox loading={false} onReady={onReady}>
      <Box flexDirection="column" padding={2} gap={1}>
        {/* Row layout with flex grow */}
        <Box flexDirection="row" gap={1}>
          <Box flexDirection="column" borderStyle="single" paddingX={1} flexGrow={1}>
            <Text bold color="blue">Sidebar</Text>
            <Text>Navigation</Text>
            <Text>Settings</Text>
          </Box>
          <Box flexDirection="column" borderStyle="single" paddingX={1} flexGrow={3}>
            <Text bold color="green">Main Content</Text>
            <Text>This panel uses flexGrow=3</Text>
            <Text>to take more horizontal space.</Text>
          </Box>
        </Box>

        {/* Footer spanning full width */}
        <Box borderStyle="single" paddingX={1} justifyContent="space-between">
          <Text dimColor>Status: Ready</Text>
          <Text dimColor>v1.0.0</Text>
        </Box>
      </Box>
    </InkTerminalBox>
  );
}
