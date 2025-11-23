"use client";

import { Box, Text, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";

export default function Terminal() {
  return (
    <InkTerminalBox>
      <Box flexDirection="column">
        <Text>Rendered with `use client` and `next/dynamic`.</Text>
      </Box>
    </InkTerminalBox>
  );
}
