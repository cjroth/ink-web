"use client";

import { InkXterm, Box, Text } from "ink-web/bundled";
import "ink-web/bundled/css";
import "xterm/css/xterm.css";

export const Terminal = () => (
  <div style={{ width: "100vw", height: "100vh" }}>
    <InkXterm focus>
      <Box flexDirection="column">
        <Text color="green">Hello from Ink!</Text>
      </Box>
    </InkXterm>
  </div>
);

export default Terminal;
