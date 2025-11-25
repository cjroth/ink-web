"use client";

import { Box, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Gradient } from "@/components/ui/gradient";
import { Ascii } from "@/components/ui/ascii";
import figlet from "figlet";
import standard from "figlet/importable-fonts/Standard.js";

// Register fonts before using them
figlet.parseFont("Standard", standard);

export default function GradientDemo({ onReady }: { onReady?: () => void }) {
  return (
    <InkTerminalBox loading={false} onReady={onReady}>
      <Box flexDirection="column">
        <Gradient name="rainbow">
          <Ascii text="Gradient" />
        </Gradient>
      </Box>
    </InkTerminalBox>
  );
}
