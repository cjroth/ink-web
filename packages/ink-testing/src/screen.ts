import stripAnsi from 'strip-ansi'

export interface Screen {
  /** Get the current screen text with ANSI codes stripped */
  text(): string
  /** Get the raw screen output including ANSI codes */
  rawText(): string
  /** Check if the screen contains the given text (ANSI stripped) */
  contains(text: string): boolean
  /** Check if the screen matches a regex (ANSI stripped) */
  matches(pattern: RegExp): boolean
  /** Get all rendered frames (ANSI stripped) */
  frames(): string[]
  /** Get all raw rendered frames (with ANSI) */
  rawFrames(): string[]
  /** Get a specific line by number (0-indexed, ANSI stripped) */
  line(n: number): string
  /** Get all non-empty lines (ANSI stripped) */
  lines(): string[]
}

export function createScreen(
  lastFrame: () => string | undefined,
  allFrames: string[],
): Screen {
  const clean = (s: string | undefined) => s ? stripAnsi(s) : ''

  return {
    text() {
      return clean(lastFrame())
    },
    rawText() {
      return lastFrame() ?? ''
    },
    contains(text: string) {
      return this.text().includes(text)
    },
    matches(pattern: RegExp) {
      return pattern.test(this.text())
    },
    frames() {
      return allFrames.map(f => stripAnsi(f))
    },
    rawFrames() {
      return [...allFrames]
    },
    line(n: number) {
      return this.text().split('\n')[n] ?? ''
    },
    lines() {
      return this.text().split('\n').filter(l => l.trim() !== '')
    },
  }
}
