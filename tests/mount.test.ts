import { expect, test } from 'bun:test'

test('mountInkInXterm exports function (browser-only)', async () => {
  if (typeof document === 'undefined') return
  const mod = await import('../src/xterm-ink')
  expect(typeof mod.mountInkInXterm).toBe('function')
})
