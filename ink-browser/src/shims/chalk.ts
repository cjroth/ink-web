// Browser shim wrapper for Chalk used by Ink rendering in Xterm
//
// Why: Chalk detects color support via `#supports-color`. In some browsers
// the detected level can be < 3, which disables truecolor/256-color output.
// Ink relies on Chalk to produce ANSI color sequences that Xterm can render.
//
// How: We import the real Chalk implementation via a Vite alias named
// 'chalk-orig' (see vite aliases). Then we force `chalk.level = 3` (16m)
// to guarantee rich colors in the browser terminal. Finally, we re-export
// everything so consumers can `import chalk from 'chalk'` as usual.
import chalk from 'chalk-orig'
;(chalk as any).level = 3

export * from 'chalk-orig'
export default chalk
