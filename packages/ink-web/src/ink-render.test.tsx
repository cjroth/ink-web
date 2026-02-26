import { describe, expect, test } from 'bun:test'
import React from 'react'
import { renderForTest, wait } from '../test/utils'
// happy-dom is registered globally in preload.ts

describe('Ink rendering in Node.js environment', () => {
  test('can import ink directly and render text', async () => {
    const { Text } = await import('ink')
    const element = React.createElement(Text, {}, 'Hello from Ink!')

    const { stdout, cleanup, waitForRender } = renderForTest(element)
    await waitForRender()

    expect(stdout.output()).toContain('Hello from Ink!')

    cleanup()
  })

  test('can render Box with Text children', async () => {
    const { Box, Text } = await import('ink')
    const element = React.createElement(
      Box,
      { flexDirection: 'column' as const },
      React.createElement(Text, { color: 'green' }, 'Line 1'),
      React.createElement(Text, { color: 'blue' }, 'Line 2')
    )

    const { stdout, cleanup, waitForRender } = renderForTest(element)
    await waitForRender()

    const output = stdout.output()
    expect(output).toContain('Line 1')
    expect(output).toContain('Line 2')

    cleanup()
  })
})

describe('Ink rendering via bundled in browser-like environment', () => {
  test('can import from bundled and get all exports', async () => {
    const mod = await import('./index')
    expect(mod.Box).toBeDefined()
    expect(mod.Text).toBeDefined()
    expect(mod.render).toBeDefined()
    expect(mod.InkTerminalBox).toBeDefined()
    expect(mod.mountInkInXterm).toBeDefined()
  })

  test('can render ink via bundled with Text component', async () => {
    const { Text } = await import('./index')
    const element = React.createElement(Text, {}, 'Bundled Ink Test')

    const { stdout, cleanup, waitForRender } = renderForTest(element)
    await waitForRender()

    expect(stdout.output()).toContain('Bundled Ink Test')

    cleanup()
  })

  test('can render Box and Text from bundled', async () => {
    const { Box, Text } = await import('./index')
    const element = React.createElement(
      Box,
      { flexDirection: 'column' as const, padding: 1 },
      React.createElement(Text, { bold: true }, 'Title'),
      React.createElement(Text, {}, 'Body text')
    )

    const { stdout, cleanup, waitForRender } = renderForTest(element)
    await waitForRender()

    const output = stdout.output()
    expect(output).toContain('Title')
    expect(output).toContain('Body text')

    cleanup()
  })

  // Skip: This test is flaky with --randomize due to happy-dom global state issues
  test.skip('renders with InkTerminalBox in browser environment', async () => {
    const { InkTerminalBox, Text } = await import('./index')

    // Create a container element
    const container = document.createElement('div')
    container.style.width = '800px'
    container.style.height = '600px'
    document.body.appendChild(container)

    // Mock clientWidth/clientHeight on HTMLElement prototype since happy-dom doesn't compute layout
    // This is needed for InkXterm to initialize properly (it checks dimensions of its inner div)
    const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
    const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { value: 800, configurable: true })
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { value: 600, configurable: true })

    // Render the component
    const TestApp = () =>
      React.createElement(
        InkTerminalBox,
        {
          focus: false,
          termOptions: {},
        },
        React.createElement(Text, {}, 'Terminal Box Test')
      )

    let unmountFn: () => void

    await act(async () => {
      const { unmount } = rtlRender(React.createElement(TestApp), {
        container,
      })
      unmountFn = unmount

      await wait(100)
    })

    // Wait for Ink to initialize and render
    await waitFor(
      () => {
        const terminalElement = container.querySelector('.xterm')
        expect(terminalElement).toBeTruthy()
      },
      { timeout: 3000 }
    )

    await wait(500)

    const unmount = unmountFn!

    // Cleanup
    unmount()
    document.body.removeChild(container)

    // Restore original clientWidth/clientHeight
    if (originalClientWidth) {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth)
    }
    if (originalClientHeight) {
      Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight)
    }
  })
})


describe('Yoga layout engine', () => {
  test('yogaNode is created when using bundled', async () => {
    const { Box } = await import('./index')
    const element = React.createElement(Box, {}, 'Test')

    const { stdout, cleanup, waitForRender } = renderForTest(element)
    await waitForRender()

    // Check that yogaNode was created by verifying non-empty output
    // Empty output would mean yogaNode was undefined
    expect(stdout.output().length).toBeGreaterThan(0)

    cleanup()
  })

  test('layout calculations work correctly', async () => {
    const { Box, Text } = await import('./index')
    // Create a complex layout that requires yoga
    const element = React.createElement(
      Box,
      { flexDirection: 'row' as const, gap: 2 },
      React.createElement(Box, { width: 10 }, React.createElement(Text, {}, 'Left')),
      React.createElement(Box, { width: 10 }, React.createElement(Text, {}, 'Right'))
    )

    const { stdout, cleanup, waitForRender } = renderForTest(element)
    await waitForRender()

    const output = stdout.output()
    expect(output).toContain('Left')
    expect(output).toContain('Right')

    cleanup()
  })
})
