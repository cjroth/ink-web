// Browser shim wrapper for Chalk used by Ink rendering in Xterm
//
// Why: Chalk detects color support via `#supports-color`. In some browsers
// the detected level can be < 3, which disables truecolor/256-color output.
// Ink relies on Chalk to produce ANSI color sequences that Xterm can render.
//
// How: We import chalk and force `chalk.level = 3` (16m)
// to guarantee rich colors in the browser terminal.

import chalk from 'chalk'
;(chalk as any).level = 3

export default chalk
