import { Box, Text } from "ink";
import { InkTerminal } from "ink-web";

const App = () => (
  <div style={{ width: "100vw", height: "100vh" }}>
    <InkTerminal focus>
      <Box flexDirection="column">
        <Text color="green">Hello from Ink!</Text>
      </Box>
    </InkTerminal>
  </div>
);

export default App;
