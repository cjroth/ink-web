"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/vite-plugin.ts
var vite_plugin_exports = {};
__export(vite_plugin_exports, {
  inkWebPlugin: () => inkWebPlugin
});
module.exports = __toCommonJS(vite_plugin_exports);
var import_node_path = __toESM(require("path"), 1);
var import_node_url = require("url");
var import_meta = {};
function inkWebPlugin() {
  return {
    name: "vite-plugin-ink-web",
    config() {
      let inkWebPath;
      try {
        inkWebPath = import_node_path.default.dirname(require.resolve("ink-web"));
      } catch {
        const __dirname = import_node_path.default.dirname((0, import_node_url.fileURLToPath)(import_meta.url));
        inkWebPath = import_node_path.default.resolve(__dirname, "..");
      }
      return {
        resolve: {
          alias: {
            // Alias Node.js built-ins to shims
            "cli-cursor": import_node_path.default.resolve(inkWebPath, "src/shims/cli-cursor.ts"),
            "supports-color": import_node_path.default.resolve(inkWebPath, "src/shims/supports-color.ts"),
            "#supports-color": import_node_path.default.resolve(inkWebPath, "src/shims/supports-color.ts"),
            "signal-exit": import_node_path.default.resolve(inkWebPath, "src/shims/signal-exit.ts"),
            "window-size": import_node_path.default.resolve(inkWebPath, "src/shims/window-size.ts"),
            tty: import_node_path.default.resolve(inkWebPath, "src/shims/tty.ts"),
            process: import_node_path.default.resolve(inkWebPath, "src/shims/process.ts"),
            "node:process": import_node_path.default.resolve(inkWebPath, "src/shims/process.ts"),
            events: import_node_path.default.resolve(inkWebPath, "src/shims/events.ts"),
            "node:events": import_node_path.default.resolve(inkWebPath, "src/shims/events.ts"),
            stream: import_node_path.default.resolve(inkWebPath, "src/shims/stream.ts"),
            "node:stream": import_node_path.default.resolve(inkWebPath, "src/shims/stream.ts"),
            module: import_node_path.default.resolve(inkWebPath, "src/shims/module.ts"),
            "node:module": import_node_path.default.resolve(inkWebPath, "src/shims/module.ts"),
            buffer: import_node_path.default.resolve(inkWebPath, "src/shims/buffer.ts"),
            "node:buffer": import_node_path.default.resolve(inkWebPath, "src/shims/buffer.ts"),
            fs: import_node_path.default.resolve(inkWebPath, "src/shims/fs.ts"),
            "node:fs": import_node_path.default.resolve(inkWebPath, "src/shims/fs.ts"),
            "node:path": "path-browserify",
            // Chalk special handling
            "chalk-orig": "chalk",
            chalk: import_node_path.default.resolve(inkWebPath, "src/shims/chalk.ts")
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  inkWebPlugin
});
//# sourceMappingURL=vite-plugin.cjs.map