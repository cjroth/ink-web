import { Box, Text } from "ink";
import { InkXterm } from "ink-web";
import "xterm/css/xterm.css";

const App = () => (
  <div style={{ width: "100vw", height: "100vh" }}>
    <InkXterm focus>
      <Box flexDirection="column">
        <Text color="green">Hello from Ink!</Text>
      </Box>
    </InkXterm>
  </div>
);

export default App;
