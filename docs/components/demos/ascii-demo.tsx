"use client";

import { Box, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Loader2 } from "lucide-react";
import { Ascii } from "@/components/ui/ascii";

export default function AsciiDemo() {
  return (
    <InkTerminalBox
      rows={10}
      loading={<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
    >
      <Box flexDirection="column">
        <Ascii text="Hello" color="cyan" />
      </Box>
    </InkTerminalBox>
  );
}
