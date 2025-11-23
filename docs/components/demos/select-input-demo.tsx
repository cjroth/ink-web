"use client";

import { useState } from "react";
import { Box, Text, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Loader2 } from "lucide-react";
import { SelectInput } from "@/components/ui/select-input";

const items = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Python", value: "py" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
];

export default function SelectInputDemo() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <InkTerminalBox
      rows={12}
      loading={<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
    >
      <Box flexDirection="column">
        <Text>Select your favorite language:</Text>
        <Text> </Text>
        <SelectInput
          items={items}
          onSelect={(item) => setSelected(item.value)}
        />
        {selected && (
          <>
            <Text> </Text>
            <Text color="green">Selected: {selected}</Text>
          </>
        )}
      </Box>
    </InkTerminalBox>
  );
}
