import { describe, expect, test } from 'bun:test'
import chalk from './chalk'

describe('chalk shim', () => {
  test('generates ANSI codes for colors', () => {
    const result = chalk.green('Hello')
    expect(result).toBe('\u001b[32mHello\u001b[39m')
  })

  test('generates ANSI codes for cyan', () => {
    const result = chalk.cyan('>')
    expect(result).toBe('\u001b[36m>\u001b[39m')
  })

  test('generates ANSI codes for bold', () => {
    const result = chalk.bold('Bold text')
    expect(result).toBe('\u001b[1mBold text\u001b[22m')
  })

  test('generates ANSI codes for dim', () => {
    const result = chalk.dim('Dim text')
    expect(result).toBe('\u001b[2mDim text\u001b[22m')
  })

  test('generates ANSI codes for inverse', () => {
    const result = chalk.inverse('Inverse')
    expect(result).toBe('\u001b[7mInverse\u001b[27m')
  })

  test('supports chaining', () => {
    const result = chalk.green.bold('Hello')
    expect(result).toContain('Hello')
    expect(result).toContain('\u001b[32m') // green
    expect(result).toContain('\u001b[1m')  // bold
  })

  test('has correct color support level', () => {
    expect(chalk.level).toBe(3)
    expect(chalk.supportsColor).toEqual({
      level: 3,
      hasBasic: true,
      has256: true,
      has16m: true,
    })
  })
})

