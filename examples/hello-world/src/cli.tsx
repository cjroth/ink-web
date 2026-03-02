import { render } from "ink";
import App from "./App";

const { waitUntilExit } = render(<App onQuit={() => process.exit(0)} />);
await waitUntilExit();
