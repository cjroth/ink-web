"use client";

import { useState, useEffect } from "react";
import { Box, Text, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Loader2 } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";

function ProgressBarContent() {
  const [cpuProgress, setCpuProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpuProgress(prev => {
        if (prev >= 1) return 0;
        return prev + 0.01;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box flexDirection="column" gap={1}>
      <Box>
        <Text>Downloading </Text>
        <ProgressBar percent={cpuProgress} left={12} color="cyan" />
      </Box>
      <Box>
        <Text>Installing  </Text>
        <ProgressBar percent={0.78} left={12} color="yellow" />
      </Box>
      <Box>
        <Text>Building    </Text>
        <ProgressBar percent={1.0} left={12} color="green" />
      </Box>
    </Box>
  );
}

export default function ProgressBarDemo() {
  return (
    <InkTerminalBox
      rows={10}
      loading={<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
    >
      <ProgressBarContent />
    </InkTerminalBox>
  );
}
