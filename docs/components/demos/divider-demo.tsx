"use client";

import { Box, Text, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Divider } from "@/components/ui/divider";

export default function DividerDemo() {
  return (
    <InkTerminalBox>
      <Box flexDirection="column" gap={1} width="100%">
        <Divider title="Options" titleColor="cyan" />
        <Box paddingLeft={2}>
          <Text>• Setting 1</Text>
        </Box>
        <Box paddingLeft={2}>
          <Text>• Setting 2</Text>
        </Box>
        <Divider title="Actions" titleColor="green" />
        <Box paddingLeft={2}>
          <Text>• Save</Text>
        </Box>
      </Box>
    </InkTerminalBox>
  );
}
