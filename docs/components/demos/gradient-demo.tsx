"use client";

import { Box, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Loader2 } from "lucide-react";
import { Gradient } from "@/components/ui/gradient";
import { Ascii } from "@/components/ui/ascii";

export default function GradientDemo() {
  return (
    <InkTerminalBox
      rows={10}
      loading={
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      }
    >
      <Box flexDirection="column">
        <Gradient name="rainbow">
          <Ascii text="Gradient" />
        </Gradient>
      </Box>
    </InkTerminalBox>
  );
}
