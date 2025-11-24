"use client";

import { Box, Text, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Loader2 } from "lucide-react";
import { Link } from "@/components/ui/link";

export default function LinkDemo() {
  return (
    <InkTerminalBox
      rows={10}
      loading={<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
    >
      <Box flexDirection="column" gap={1}>
        <Box>
          <Text>Check out </Text>
          <Link url="https://github.com">GitHub</Link>
          <Text> for more info.</Text>
        </Box>
        <Box>
          <Text>Read the </Text>
          <Link url="https://github.com/vadimdemedes/ink">Ink documentation</Link>
        </Box>
      </Box>
    </InkTerminalBox>
  );
}
