import path from 'path'

// Aliases required to run Ink and Chalk in the browser with shims
export function inkBrowserAliases(rootDir: string) {
  const r = (p: string) => path.resolve(rootDir, p)
  return [
    { find: 'cli-cursor', replacement: r('src/shims/cli-cursor.ts') },
    { find: 'supports-color', replacement: r('src/shims/supports-color.ts') },
    { find: '#supports-color', replacement: r('src/shims/supports-color.ts') },
    { find: 'signal-exit', replacement: r('src/shims/signal-exit.ts') },
    { find: 'window-size', replacement: r('src/shims/window-size.ts') },
    { find: 'tty', replacement: r('src/shims/tty.ts') },
    { find: 'process', replacement: r('src/shims/process.ts') },
    { find: 'node:process', replacement: r('src/shims/process.ts') },
    { find: 'events', replacement: r('src/shims/events.ts') },
    { find: 'node:events', replacement: r('src/shims/events.ts') },
    { find: 'stream', replacement: r('src/shims/stream.ts') },
    { find: 'node:stream', replacement: r('src/shims/stream.ts') },
    { find: 'module', replacement: r('src/shims/module.ts') },
    { find: 'node:module', replacement: r('src/shims/module.ts') },
    { find: 'buffer', replacement: r('src/shims/buffer.ts') },
    { find: 'node:buffer', replacement: r('src/shims/buffer.ts') },
    { find: 'fs', replacement: r('src/shims/fs.ts') },
    { find: 'node:fs', replacement: r('src/shims/fs.ts') },
    { find: 'chalk-orig', replacement: r('node_modules/chalk/source/index.js') },
    { find: 'chalk', replacement: r('src/shims/chalk.ts') },
  ] as { find: string; replacement: string }[]
}
