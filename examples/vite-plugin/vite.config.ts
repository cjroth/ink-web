import { inkWebPlugin } from "ink-web/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), inkWebPlugin()],
});
