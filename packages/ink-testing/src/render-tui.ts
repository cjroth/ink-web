import { render, cleanup as inkCleanup } from 'ink-testing-library'
import type { ReactNode } from 'react'
import { createKeySender, type KeySender } from './keys.ts'
import { createScreen, type Screen } from './screen.ts'
import { waitFor as waitForImpl, type WaitForOptions } from './wait-for.ts'

export interface TuiInstance {
  /** Screen query helpers — read what's currently rendered */
  screen: Screen
  /** Keyboard input helpers — send keys to the TUI */
  keys: KeySender
  /**
   * Flush pending React renders. Call after sending keys when you
   * want to synchronously assert on the screen without waitFor.
   *
   * @example
   * tui.keys.enter()
   * await tui.flush()
   * expect(tui.screen.text()).toContain('Step 2')
   */
  flush(): Promise<void>
  /**
   * Wait for a condition to be met.
   *
   * @example
   * // Wait for text to appear
   * await tui.waitFor('Step 2')
   *
   * // Wait for a custom assertion
   * await tui.waitFor(() => {
   *   expect(tui.screen.text()).toContain('Imported')
   * })
   */
  waitFor(condition: string | (() => void), options?: WaitForOptions): Promise<void>
  /** Re-render with a new element */
  rerender(node: ReactNode): void
  /** Unmount the component */
  unmount(): void
  /** Access the underlying ink-testing-library instance */
  ink: ReturnType<typeof render>
}

/**
 * Render an Ink component for testing with ergonomic helpers.
 *
 * @example
 * ```tsx
 * import { renderTui } from 'ink-testing'
 *
 * const tui = renderTui(<Wizard dataDir="/tmp" />)
 *
 * await tui.waitFor('demo portfolio')
 * tui.keys.enter()
 * await tui.waitFor('Imported')
 *
 * tui.unmount()
 * ```
 */
export function renderTui(node: ReactNode): TuiInstance {
  const instance = render(node)
  const screen = createScreen(instance.lastFrame, instance.frames)
  const keys = createKeySender((data) => instance.stdin.write(data))

  const flush = async () => {
    // Two ticks: one for React's batchedUpdates to process state,
    // one for the re-render to commit and write to stdout
    await new Promise<void>(r => setTimeout(r, 0))
    await new Promise<void>(r => setTimeout(r, 0))
  }

  return {
    screen,
    keys,
    flush,
    async waitFor(condition, options) {
      await waitForImpl(condition, () => screen.text(), options)
    },
    rerender: instance.rerender,
    unmount() {
      instance.unmount()
      instance.cleanup()
    },
    ink: instance,
  }
}

/** Clean up all rendered instances */
export { inkCleanup as cleanup }
