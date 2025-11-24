"use client";

import { Box, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Ascii } from "@/components/ui/ascii";

export default function AsciiDemo() {
  return (
    <InkTerminalBox>
      <Box flexDirection="column">
        <Ascii text="Hello" color="cyan" />
      </Box>
    </InkTerminalBox>
  );
}
