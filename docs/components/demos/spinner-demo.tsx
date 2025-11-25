"use client";

import { Box, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Spinner } from "@/components/ui/spinner";

export default function SpinnerDemo({ onReady }: { onReady?: () => void }) {
  return (
    <InkTerminalBox loading={false} onReady={onReady}>
      <Box flexDirection="column">
        <Spinner text="Thinking" />
      </Box>
    </InkTerminalBox>
  );
}
