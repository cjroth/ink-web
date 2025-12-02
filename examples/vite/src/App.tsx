"use client";

import { InkTerminal, Box, Text } from "ink-web/bundled";
import "ink-web/bundled/css";

export const Terminal = () => (
  <div style={{ width: "100vw", height: "100vh" }}>
    <InkTerminal focus>
      <Box flexDirection="column">
        <Text color="green">Hello from Ink!</Text>
      </Box>
    </InkTerminal>
  </div>
);

export default Terminal;
