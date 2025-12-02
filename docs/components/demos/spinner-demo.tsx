"use client";

import { Box } from "ink";
import { InkTerminalBox } from "ink-web";
import "ink-web/css";
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
