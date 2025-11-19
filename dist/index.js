// src/InkXterm.tsx
import { useEffect, useRef } from "react";

// src/xterm-ink.tsx
import { FitAddon } from "@xterm/addon-fit";
import { render } from "ink";
import { Terminal } from "xterm";

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
  const term = new Terminal({
    convertEol: true,
    disableStdin: false,
    cols: initialCols,
    rows: initialRows,
    ...opts.termOptions
  });
  const fitAddon = new FitAddon();
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
  stdoutBase.write = (chunk, encoding, cb) => {
    const str = typeof chunk === "string" ? chunk : String(chunk);
    console.log("\u270D\uFE0F stdout.write() called with:", JSON.stringify(str.substring(0, 100)));
    const lines = str.split("\n");
    lines.forEach((line, index) => {
      const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, "");
      console.log(`Row ${index} text length: ${cleanLine.length} chars`);
    });
    term.write(str);
    if (typeof encoding === "function") {
      encoding();
    } else if (cb) {
      cb();
    }
    return true;
  };
  const stdout = Object.assign(stdoutBase, {
    columns: term.cols,
    rows: term.rows,
    isTTY: true,
    writable: true,
    setDefaultEncoding: (_enc) => stdout,
    cork: () => {
    },
    uncork: () => {
    }
  });
  console.log("\u{1F4CA} stdout properties:", {
    isTTY: stdout.isTTY,
    writable: stdout.writable,
    columns: stdout.columns,
    rows: stdout.rows,
    hasWrite: typeof stdout.write === "function"
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
  const originalWrite = stdout.write.bind(stdout);
  let writeCallCount = 0;
  stdout.write = (chunk, encoding, cb) => {
    writeCallCount++;
    console.log(`\u{1F4DE} stdout.write called (call #${writeCallCount})`);
    return originalWrite(chunk, encoding, cb);
  };
  console.log("\u2699\uFE0F Checking yoga initialization...");
  console.log("\u2699\uFE0F globalThis.__yogaPromise exists:", typeof globalThis.__yogaPromise !== "undefined");
  getYogaInit().then(() => {
    console.log("\u2705 Yoga init promise resolved");
    return new Promise((resolve) => setTimeout(resolve, 500));
  }).then(async () => {
    console.log("\u{1F3A8} About to call Ink render() with element:", element);
    console.log("\u{1F3A8} Element type:", element.type);
    console.log("\u{1F3A8} Element props:", element.props);
    await new Promise((resolve) => setTimeout(resolve, 100));
    instance = render(element, {
      stdout,
      stderr: stdout,
      stdin,
      patchConsole: false,
      debug: true
      // Enable debug mode to bypass logUpdate throttling
    });
    console.log("\u2705 Ink render() returned instance:", instance);
    console.log("\u{1F50D} stdout dimensions for Ink:", {
      columns: stdout.columns,
      rows: stdout.rows,
      isTTY: stdout.isTTY
    });
    setTimeout(() => {
      console.log("\u{1F9EA} Manual test: calling stdout.write directly...");
      stdout.write("MANUAL TEST 1\n");
    }, 200);
    setTimeout(() => {
      console.log("\u{1F504} Emitting resize event on stdout...");
      stdout.emit("resize");
    }, 300);
    setTimeout(() => {
      console.log("\u{1F504} Calling instance.rerender()...");
      instance.rerender(element);
    }, 500);
    setTimeout(() => {
      console.log("\u{1F9EA} Manual test 2: calling stdout.write after rerender...");
      stdout.write("MANUAL TEST 2\n");
    }, 700);
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
import { jsx } from "react/jsx-runtime";
var InkXterm = ({ className = "", focus, termOptions, children }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const initTimeout = setTimeout(() => {
      if (!containerRef.current) return;
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
  return /* @__PURE__ */ jsx("div", { className, ref: containerRef, style: { width: "100%", height: "100%" } });
};

// src/InkTerminalBox.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var InkTerminalBox = ({ className = "", focus, termOptions, children }) => {
  return /* @__PURE__ */ jsx2("div", { className: `ink-terminal-box ${className}`, children: /* @__PURE__ */ jsx2("div", { className: "ink-terminal-reset", children: /* @__PURE__ */ jsx2(InkXterm, { focus, termOptions, children }) }) });
};

// src/DemoApp.tsx
import { Box, Text, useInput } from "ink";
import React2, { useState } from "react";
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var DemoApp = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  useInput((inputChar, key) => {
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
  return /* @__PURE__ */ jsxs(Box, { flexDirection: "column", children: [
    /* @__PURE__ */ jsx3(Text, { color: "green", children: "Ink + Xterm (browser)" }),
    /* @__PURE__ */ jsxs(Text, { dimColor: true, children: [
      "React version: ",
      React2.version
    ] }),
    /* @__PURE__ */ jsx3(Text, { dimColor: true, children: "Type something and press Enter..." }),
    /* @__PURE__ */ jsx3(Text, { children: " " }),
    history.length > 0 && /* @__PURE__ */ jsxs(Box, { flexDirection: "column", children: [
      /* @__PURE__ */ jsx3(Text, { bold: true, children: "History:" }),
      history.map((item, i) => /* @__PURE__ */ jsxs(Text, { children: [
        " ",
        item
      ] }, i)),
      /* @__PURE__ */ jsx3(Text, { children: " " })
    ] }),
    /* @__PURE__ */ jsxs(Text, { children: [
      /* @__PURE__ */ jsx3(Text, { color: "cyan", children: "> " }),
      /* @__PURE__ */ jsx3(Text, { children: input }),
      /* @__PURE__ */ jsx3(Text, { inverse: true, children: " " })
    ] })
  ] });
};
export {
  DemoApp,
  InkTerminalBox,
  InkXterm,
  mountInkInXterm
};
//# sourceMappingURL=index.js.map