"use client";

import { Box, Text } from "ink";
import { InkTerminalBox } from "ink-web";
import "ink-web/css";
import "xterm/css/xterm.css";
import { Link } from "@/components/ui/link";

export default function LinkDemo({ onReady }: { onReady?: () => void }) {
  return (
    <InkTerminalBox loading={false} onReady={onReady}>
      <Box flexDirection="column" gap={1}>
        <Box>
          <Text>Check out </Text>
          <Link url="https://github.com">GitHub</Link>
          <Text> for more info.</Text>
        </Box>
      </Box>
    </InkTerminalBox>
  );
}
