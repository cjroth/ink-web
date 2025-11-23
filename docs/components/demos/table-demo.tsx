"use client";

import { Box, InkTerminalBox } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";
import { Loader2 } from "lucide-react";
import { Table } from "@/components/ui/table";

const data = [
  { name: "React", type: "Library", stars: 220000 },
  { name: "Vue", type: "Framework", stars: 206000 },
  { name: "Angular", type: "Framework", stars: 95000 },
  { name: "Svelte", type: "Compiler", stars: 77000 },
];

export default function TableDemo() {
  return (
    <InkTerminalBox
      rows={12}
      loading={<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
    >
      <Box flexDirection="column">
        <Table data={data} />
      </Box>
    </InkTerminalBox>
  );
}
