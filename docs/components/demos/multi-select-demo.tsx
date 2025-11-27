"use client";

import { useState } from "react";
import { Box, Text } from "ink";
import { InkTerminalBox } from "ink-web";
import "ink-web/css";
import "xterm/css/xterm.css";
import { MultiSelect, MultiSelectItem } from "@/components/ui/multi-select";

const items = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Python", value: "py" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
];

export default function MultiSelectDemo({ onReady }: { onReady?: () => void }) {
  const [submitted, setSubmitted] = useState<MultiSelectItem<string>[] | null>(null);

  return (
    <InkTerminalBox loading={false} onReady={onReady}>
      <Box flexDirection="column">
        <Text>Select your favorite languages:</Text>
        <Text dimColor>(Space to toggle, Enter to submit)</Text>
        <Text> </Text>
        <MultiSelect
          items={items}
          onSubmit={(selected) => setSubmitted(selected)}
        />
        {submitted && (
          <>
            <Text> </Text>
            <Text color="green">
              Selected: {submitted.map(i => i.label).join(', ') || 'None'}
            </Text>
          </>
        )}
      </Box>
    </InkTerminalBox>
  );
}
