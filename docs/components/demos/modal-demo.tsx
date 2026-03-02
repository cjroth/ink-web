"use client";

import { useState } from "react";
import { Box, Text, useInput, useStdout } from "ink";
import { InkTerminalBox } from "ink-web";
import "ink-web/css";
import "@xterm/xterm/css/xterm.css";
import { Modal } from "@/components/ui/modal";
import { StatusBar } from "@/components/ui/status-bar";

function ModalDemoInner() {
  const [isOpen, setIsOpen] = useState(false);
  const { stdout } = useStdout();
  const rows = stdout?.rows ?? 24;

  useInput((input, key) => {
    if (!isOpen && input === "m") {
      setIsOpen(true);
    }
    if (isOpen && (input === "q" || key.escape)) {
      setIsOpen(false);
    }
  });

  if (isOpen) {
    return (
      <Box flexDirection="column" height={rows - 1}>
        <Modal title="Example Modal">
          <Box paddingX={1} flexDirection="column">
            <Text>This is a modal overlay component.</Text>
            <Text> </Text>
            <Text dimColor>It stretches to fill the full terminal height.</Text>
          </Box>
        </Modal>
        <StatusBar items={[{ key: "q", label: "close" }]} />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height={rows} alignItems="center" justifyContent="center">
      <Text dimColor>Press <Text inverse bold> m </Text> to open modal</Text>
    </Box>
  );
}

export default function ModalDemo({ onReady }: { onReady?: () => void }) {
  return (
    <InkTerminalBox loading={false} onReady={onReady} focus>
      <ModalDemoInner />
    </InkTerminalBox>
  );
}
