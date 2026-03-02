import { createRoot } from "react-dom/client";
import { InkXterm } from "ink-web/core";
import "@xterm/xterm/css/xterm.css";
import App from "./App";

function BrowserApp() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <InkXterm focus>
        <App />
      </InkXterm>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<BrowserApp />);
