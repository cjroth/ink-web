import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { setupHappyDom, renderForTest } from '../../test/utils'
import { TextInput } from './text-input'

beforeAll(() => {
  setupHappyDom()
})

describe('TextInput Component', () => {
  test('renders with default prompt', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(<TextInput />)
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders with custom prompt', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(<TextInput prompt="$ " />)
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders with placeholder', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <TextInput placeholder="Type something..." />
    )
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders with controlled value', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <TextInput value="Hello" onChange={() => {}} />
    )
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders without cursor when not focused', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(<TextInput focus={false} />)
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })
})
