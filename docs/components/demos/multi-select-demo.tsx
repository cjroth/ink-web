"use client";

import { useState } from "react";
import { Box, Text, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Loader2 } from "lucide-react";
import { MultiSelect, MultiSelectItem } from "@/components/ui/multi-select";

const items = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Python", value: "py" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
];

export default function MultiSelectDemo() {
  const [submitted, setSubmitted] = useState<MultiSelectItem<string>[] | null>(null);

  return (
    <InkTerminalBox
      rows={14}
      loading={<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
    >
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
