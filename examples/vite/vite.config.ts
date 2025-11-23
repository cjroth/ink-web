import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   alias: {
  //     process: path.resolve(__dirname, "src/process-shim.js"),
  //     events: "events",
  //     "node:events": "events",
  //     stream: "stream-browserify",
  //     "node:stream": "stream-browserify",
  //   },
  // },
});
