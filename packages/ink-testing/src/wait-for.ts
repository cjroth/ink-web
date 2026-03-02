export interface WaitForOptions {
  /** Timeout in milliseconds (default: 3000) */
  timeout?: number
  /** Polling interval in milliseconds (default: 50) */
  interval?: number
}

const DEFAULT_TIMEOUT = 3000
const DEFAULT_INTERVAL = 50

/**
 * Polls until a condition is met or timeout is reached.
 *
 * Accepts either:
 *   - A string: waits until screen.text() contains it
 *   - A function: waits until it stops throwing (like RTL's waitFor)
 */
export async function waitFor(
  condition: string | (() => void),
  screenText: () => string,
  options: WaitForOptions = {},
): Promise<void> {
  const timeout = options.timeout ?? DEFAULT_TIMEOUT
  const interval = options.interval ?? DEFAULT_INTERVAL
  const start = Date.now()
  let lastError: Error | undefined

  const check = () => {
    if (typeof condition === 'string') {
      const current = screenText()
      if (!current.includes(condition)) {
        throw new Error(
          `Timed out waiting for text: "${condition}"\n\nScreen content:\n${current}`,
        )
      }
    } else {
      condition()
    }
  }

  while (Date.now() - start < timeout) {
    try {
      check()
      return
    } catch (e) {
      lastError = e as Error
    }
    await new Promise(r => setTimeout(r, interval))
  }

  // One final attempt
  try {
    check()
    return
  } catch (e) {
    lastError = e as Error
  }

  throw lastError ?? new Error('waitFor timed out')
}
