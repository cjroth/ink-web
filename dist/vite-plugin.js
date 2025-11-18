var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/vite-plugin.ts
import path from "path";
import { fileURLToPath } from "url";
function inkWebPlugin() {
  return {
    name: "vite-plugin-ink-web",
    config() {
      let inkWebPath;
      try {
        inkWebPath = path.dirname(__require.resolve("ink-web"));
      } catch {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        inkWebPath = path.resolve(__dirname, "..");
      }
      return {
        resolve: {
          alias: {
            // Alias Node.js built-ins to shims
            "cli-cursor": path.resolve(inkWebPath, "src/shims/cli-cursor.ts"),
            "supports-color": path.resolve(inkWebPath, "src/shims/supports-color.ts"),
            "#supports-color": path.resolve(inkWebPath, "src/shims/supports-color.ts"),
            "signal-exit": path.resolve(inkWebPath, "src/shims/signal-exit.ts"),
            "window-size": path.resolve(inkWebPath, "src/shims/window-size.ts"),
            tty: path.resolve(inkWebPath, "src/shims/tty.ts"),
            process: path.resolve(inkWebPath, "src/shims/process.ts"),
            "node:process": path.resolve(inkWebPath, "src/shims/process.ts"),
            events: path.resolve(inkWebPath, "src/shims/events.ts"),
            "node:events": path.resolve(inkWebPath, "src/shims/events.ts"),
            stream: path.resolve(inkWebPath, "src/shims/stream.ts"),
            "node:stream": path.resolve(inkWebPath, "src/shims/stream.ts"),
            module: path.resolve(inkWebPath, "src/shims/module.ts"),
            "node:module": path.resolve(inkWebPath, "src/shims/module.ts"),
            buffer: path.resolve(inkWebPath, "src/shims/buffer.ts"),
            "node:buffer": path.resolve(inkWebPath, "src/shims/buffer.ts"),
            fs: path.resolve(inkWebPath, "src/shims/fs.ts"),
            "node:fs": path.resolve(inkWebPath, "src/shims/fs.ts"),
            "node:path": "path-browserify",
            // Chalk special handling
            "chalk-orig": "chalk",
            chalk: path.resolve(inkWebPath, "src/shims/chalk.ts")
          }
        },
        build: {
          target: "esnext"
          // Support top-level await
        },
        optimizeDeps: {
          esbuildOptions: {
            target: "esnext"
            // Support top-level await in dependencies
          }
        },
        define: {
          "process.env": "{}"
        }
      };
    }
  };
}
export {
  inkWebPlugin
};
//# sourceMappingURL=vite-plugin.js.map