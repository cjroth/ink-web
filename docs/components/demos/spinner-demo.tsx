"use client";

import { Box, Text, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { useEffect, useState } from "react";
import { MacWindow } from "@/components/ui/mac-window";

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const Spinner = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return <Text color="gray">{frames[frame]} Thinking</Text>;
};

export default function SpinnerDemo() {
  return (
    <MacWindow title="Terminal">
      <InkTerminalBox>
        <Box flexDirection="column">
          <Spinner />
        </Box>
      </InkTerminalBox>
    </MacWindow>
  );
}
