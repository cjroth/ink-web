// Preload script for consistent test environment

// Force color output to be consistent regardless of TTY detection
// Chalk caches color support at module load time based on tty.isatty()
// which can vary between test runs. Setting FORCE_COLOR ensures deterministic output.
process.env.FORCE_COLOR = '3'
