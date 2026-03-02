/** Raw key sequences that Ink's parse-keypress understands */
export const KEY = {
  return: '\r',
  escape: '\x1b',
  tab: '\t',
  backspace: '\x7f',
  delete: '\x1b[3~',
  up: '\x1b[A',
  down: '\x1b[B',
  right: '\x1b[C',
  left: '\x1b[D',
  pageUp: '\x1b[5~',
  pageDown: '\x1b[6~',
  home: '\x1b[H',
  end: '\x1b[F',
  space: ' ',
  ctrlC: '\x03',
} as const

export type KeyName = keyof typeof KEY

export interface KeySender {
  /** Send raw data to stdin */
  raw(data: string): void
  /** Press Enter/Return */
  enter(): void
  /** Press Escape */
  escape(): void
  /** Press Tab */
  tab(): void
  /** Press Backspace */
  backspace(): void
  /** Press Delete */
  delete(): void
  /** Press Up arrow */
  up(): void
  /** Press Down arrow */
  down(): void
  /** Press Left arrow */
  left(): void
  /** Press Right arrow */
  right(): void
  /** Press Space */
  space(): void
  /** Press Page Up */
  pageUp(): void
  /** Press Page Down */
  pageDown(): void
  /** Press Home */
  home(): void
  /** Press End */
  end(): void
  /** Type a string (sends each character individually) */
  type(text: string): void
  /** Press a single character key */
  press(char: string): void
}

export function createKeySender(write: (data: string) => void): KeySender {
  return {
    raw: write,
    enter: () => write(KEY.return),
    escape: () => write(KEY.escape),
    tab: () => write(KEY.tab),
    backspace: () => write(KEY.backspace),
    delete: () => write(KEY.delete),
    up: () => write(KEY.up),
    down: () => write(KEY.down),
    left: () => write(KEY.left),
    right: () => write(KEY.right),
    space: () => write(KEY.space),
    pageUp: () => write(KEY.pageUp),
    pageDown: () => write(KEY.pageDown),
    home: () => write(KEY.home),
    end: () => write(KEY.end),
    type(text: string) {
      for (const char of text) {
        write(char)
      }
    },
    press(char: string) {
      write(char)
    },
  }
}
