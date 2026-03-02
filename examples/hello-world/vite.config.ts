import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { inkWebPlugin } from "ink-web/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), inkWebPlugin()],
  resolve: {
    alias: {
      "@ink-ui": path.resolve(__dirname, "../../packages/ink-ui/components"),
    },
  },
});
