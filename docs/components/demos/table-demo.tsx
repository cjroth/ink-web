"use client";

import { Box } from "ink";
import { InkTerminalBox } from "ink-web";
import "ink-web/css";
import { Table } from "@/components/ui/table";

const data = [
  { name: "React", type: "Library", stars: 220000 },
  { name: "Vue", type: "Framework", stars: 206000 },
  { name: "Angular", type: "Framework", stars: 95000 },
  { name: "Svelte", type: "Compiler", stars: 77000 },
];

export default function TableDemo({ onReady }: { onReady?: () => void }) {
  return (
    <InkTerminalBox loading={false} onReady={onReady}>
      <Box flexDirection="column">
        <Table data={data} />
      </Box>
    </InkTerminalBox>
  );
}
