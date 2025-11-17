import { expect, test } from 'bun:test'

test('exports mountInkInXterm (browser-only)', async () => {
  if (typeof document === 'undefined') return
  const mod = await import('./xterm-ink')
  expect(typeof mod.mountInkInXterm).toBe('function')
})
