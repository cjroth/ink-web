"use client";

import { Box, InkTerminalBox, Newline } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Ascii } from "@/components/ui/ascii";
import figlet from "figlet";
import doom from "figlet/importable-fonts/Doom.js";

// Register fonts before using them
figlet.parseFont("Doom", doom);

export default function AsciiDemo({ onReady }: { onReady?: () => void }) {
  return (
    <InkTerminalBox loading={false} onReady={onReady}>
      <Box flexDirection="column" alignItems="center">
        <Ascii text="Ink" color="cyan" font="Doom" />
        <Ascii text="Web" color="yellow" font="Doom" />
      </Box>
    </InkTerminalBox>
  );
}
