import { expect, test } from 'bun:test'

test('mountInk exports function (browser-only)', async () => {
  if (typeof document === 'undefined') return
  const mod = await import('../src/ghostty-ink')
  expect(typeof mod.mountInk).toBe('function')
})
