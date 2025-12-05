import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { Text } from 'ink'
import { setupHappyDom, renderForTest } from '../../test/utils'
import { Gradient } from './gradient'

beforeAll(() => {
  setupHappyDom()
})

describe('Gradient Component', () => {
  test('renders with rainbow gradient', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Gradient name="rainbow">
        <Text>Hello</Text>
      </Gradient>
    )
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders with custom colors', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Gradient colors={['#ff0000', '#0000ff']}>
        <Text>Test</Text>
      </Gradient>
    )
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('throws error when both name and colors provided', () => {
    expect(() => {
      Gradient({ name: 'rainbow', colors: ['#ff0000'], children: 'Test' })
    }).toThrow('mutually exclusive')
  })

  test('throws error when neither name nor colors provided', () => {
    expect(() => {
      Gradient({ children: 'Test' })
    }).toThrow('must be provided')
  })
})
