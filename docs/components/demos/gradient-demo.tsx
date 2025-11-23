"use client";

import { Box, InkTerminalBox, Text } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Loader2 } from "lucide-react";
import { Gradient } from "@/components/ui/gradient";

export default function GradientDemo() {
  return (
    <InkTerminalBox
      rows={20}
      loading={<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
    >
      <Box flexDirection="column" gap={1}>
        <Gradient name="rainbow">
          <Text bold>🌈 Rainbow Gradient</Text>
        </Gradient>

        <Gradient name="passion">
          <Text>❤️  Passion Gradient</Text>
        </Gradient>

        <Gradient name="cristal">
          <Text>💎 Cristal Gradient</Text>
        </Gradient>

        <Gradient name="instagram">
          <Text>📸 Instagram Gradient</Text>
        </Gradient>

        <Gradient name="summer">
          <Text>☀️  Summer Gradient</Text>
        </Gradient>

        <Gradient colors={['#ff0000', '#00ff00', '#0000ff']}>
          <Text>🎨 Custom RGB Gradient</Text>
        </Gradient>
      </Box>
    </InkTerminalBox>
  );
}
