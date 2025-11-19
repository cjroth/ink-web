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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  DemoApp: () => DemoApp,
  InkTerminalBox: () => InkTerminalBox,
  InkXterm: () => InkXterm,
  mountInkInXterm: () => mountInkInXterm
});
module.exports = __toCommonJS(src_exports);

// src/InkXterm.tsx
var import_react = require("react");

// src/xterm-ink.tsx
var import_addon_fit = require("@xterm/addon-fit");
var import_ink = require("ink");
var import_xterm = require("xterm");

// src/shims/events.ts
var EventEmitter = class {
  constructor() {
    this.listenerMap = /* @__PURE__ */ new Map();
  }
  on(event, listener) {
    let set = this.listenerMap.get(event);
    if (!set) {
      set = /* @__PURE__ */ new Set();
      this.listenerMap.set(event, set);
    }
    set.add(listener);
    return this;
  }
  addListener(event, listener) {
    return this.on(event, listener);
  }
  off(event, listener) {
    const set = this.listenerMap.get(event);
    if (set) set.delete(listener);
    return this;
  }
  removeListener(event, listener) {
    return this.off(event, listener);
  }
  once(event, listener) {
    const wrapped = (...args) => {
      this.off(event, wrapped);
      listener(...args);
    };
    return this.on(event, wrapped);
  }
  emit(event, ...args) {
    const set = this.listenerMap.get(event);
    if (!set || set.size === 0) return false;
    for (const listener of Array.from(set)) listener(...args);
    return true;
  }
  removeAllListeners(event) {
    if (typeof event === "string") {
      this.listenerMap.delete(event);
    } else {
      this.listenerMap.clear();
    }
    return this;
  }
};
var events_default = EventEmitter;

// src/shims/stream.ts
var Stream = class extends events_default {
};
var Writable = class extends Stream {
  constructor() {
    super(...arguments);
    this.writable = true;
  }
  write(chunk, _encoding, cb) {
    const data = typeof chunk === "string" ? chunk : String(chunk);
    this.emit("data", data);
    if (cb) cb();
    return true;
  }
  end() {
    this.emit("end");
  }
  cork() {
  }
  uncork() {
  }
  setDefaultEncoding(_enc) {
    return this;
  }
};
var Readable = class extends Stream {
  constructor() {
    super(...arguments);
    this.readable = true;
  }
  setEncoding(_enc) {
    return this;
  }
  resume() {
    return this;
  }
  pause() {
    return this;
  }
  pipe(_dest) {
    return _dest;
  }
  unpipe() {
    return this;
  }
};

// src/xterm-ink.tsx
var getYogaInit = () => {
  if (typeof globalThis !== "undefined" && globalThis.__yogaPromise) {
    return globalThis.__yogaPromise.then(() => void 0);
  }
  return Promise.resolve();
};
function mountInkInXterm(element, opts) {
  const containerWidth = opts.container.clientWidth;
  const containerHeight = opts.container.clientHeight;
  const charWidth = 9;
  const charHeight = 17;
  const initialCols = Math.floor(containerWidth / charWidth) || 80;
  const initialRows = Math.floor(containerHeight / charHeight) || 24;
  const term = new import_xterm.Terminal({
    convertEol: true,
    disableStdin: false,
    cols: initialCols,
    rows: initialRows,
    ...opts.termOptions
  });
  const fitAddon = new import_addon_fit.FitAddon();
  term.open(opts.container);
  term.loadAddon(fitAddon);
  if (opts.focus !== false) {
    setTimeout(() => {
      try {
        term.focus();
      } catch (e) {
        console.warn("Error focusing terminal:", e);
      }
    }, 100);
  }
  const stdoutBase = new Writable();
  const stdout = Object.assign(stdoutBase, {
    columns: term.cols,
    rows: term.rows,
    isTTY: true,
    write: (str, encoding, cb) => {
      term.write(str);
      if (typeof encoding === "function") {
        encoding();
      } else if (cb) {
        cb();
      }
      return true;
    },
    setDefaultEncoding: (_enc) => stdout,
    cork: () => {
    },
    uncork: () => {
    }
  });
  const stdinBase = new Readable();
  const inputBuffer = [];
  const stdin = Object.assign(stdinBase, {
    columns: term.cols,
    rows: term.rows,
    isTTY: true,
    setEncoding: (_enc) => {
    },
    setRawMode: (_raw) => {
    },
    resume: () => {
    },
    pause: () => {
    },
    ref: () => {
    },
    unref: () => {
    },
    read: () => {
      return inputBuffer.length > 0 ? inputBuffer.shift() : null;
    }
  });
  term.onData((data) => {
    inputBuffer.push(data);
    stdin.emit("readable");
  });
  const updateStreamsSize = () => {
    const cols = term.cols;
    const rows = term.rows;
    stdout.columns = cols;
    stdout.rows = rows;
    stdin.columns = cols;
    stdin.rows = rows;
    stdout.emit("resize");
  };
  updateStreamsSize();
  let instance;
  getYogaInit().then(() => {
    instance = (0, import_ink.render)(element, {
      stdout,
      stderr: stdout,
      stdin,
      patchConsole: false,
      debug: false
    });
  }).catch((e) => {
    console.error("Error initializing Yoga or rendering Ink:", e);
  });
  const resize = () => {
    try {
      if (term._core?.viewport) {
        fitAddon.fit();
        updateStreamsSize();
      }
    } catch (e) {
      console.error("Error during resize:", e);
    }
  };
  const ro = new ResizeObserver(() => {
    resize();
  });
  ro.observe(opts.container);
  const onWindowResize = () => resize();
  window.addEventListener("resize", onWindowResize);
  setTimeout(() => {
    resize();
  }, 200);
  return {
    term,
    unmount: async () => {
      try {
        if (instance) {
          instance.unmount();
        }
      } finally {
        try {
          ro.disconnect();
        } catch {
        }
        window.removeEventListener("resize", onWindowResize);
        term.dispose();
      }
    }
  };
}

// src/InkXterm.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var InkXterm = ({ className = "", focus, termOptions, children }) => {
  const containerRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!containerRef.current) return;
    const initTimeout = setTimeout(() => {
      if (!containerRef.current) return;
      console.log("Container is ready, mounting Ink in xterm");
      const { unmount } = mountInkInXterm(children, { container: containerRef.current, focus, termOptions });
      containerRef.current._unmount = unmount;
    }, 100);
    return () => {
      clearTimeout(initTimeout);
      const unmount = containerRef.current?._unmount;
      if (unmount) {
        void unmount();
      }
    };
  }, [children, focus, termOptions]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className, ref: containerRef, style: { width: "100%", height: "100%" } });
};

// src/InkTerminalBox.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var InkTerminalBox = ({ className = "", focus, termOptions, children }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: `ink-terminal-box ${className}`, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "ink-terminal-reset", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InkXterm, { focus, termOptions, children }) }) });
};

// src/DemoApp.tsx
var import_ink2 = require("ink");
var import_react2 = __toESM(require("react"), 1);
var import_jsx_runtime3 = require("react/jsx-runtime");
var DemoApp = () => {
  const [input, setInput] = (0, import_react2.useState)("");
  const [history, setHistory] = (0, import_react2.useState)([]);
  (0, import_ink2.useInput)((inputChar, key) => {
    if (key.return) {
      if (input.trim()) {
        setHistory((prev) => [...prev, input]);
        setInput("");
      }
    } else if (key.backspace || key.delete) {
      setInput((prev) => prev.slice(0, -1));
    } else if (!key.ctrl && !key.meta && inputChar) {
      setInput((prev) => prev + inputChar);
    }
  });
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_ink2.Box, { flexDirection: "column", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_ink2.Text, { color: "green", children: "Ink + Xterm (browser)" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_ink2.Text, { dimColor: true, children: [
      "React version: ",
      import_react2.default.version
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_ink2.Text, { dimColor: true, children: "Type something and press Enter..." }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_ink2.Text, { children: " " }),
    history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_ink2.Box, { flexDirection: "column", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_ink2.Text, { bold: true, children: "History:" }),
      history.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_ink2.Text, { children: [
        " ",
        item
      ] }, i)),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_ink2.Text, { children: " " })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_ink2.Text, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_ink2.Text, { color: "cyan", children: "> " }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_ink2.Text, { children: input }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_ink2.Text, { inverse: true, children: " " })
    ] })
  ] });
};
//# sourceMappingURL=index.cjs.map