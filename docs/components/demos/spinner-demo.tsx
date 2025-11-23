"use client";

import { Box, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Loader2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function SpinnerDemo() {
  return (
    <InkTerminalBox
      rows={10}
      loading={<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
    >
      <Box flexDirection="column">
        <Spinner text="Thinking" />
      </Box>
    </InkTerminalBox>
  );
}
