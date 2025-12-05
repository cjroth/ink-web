import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { setupHappyDom, renderForTest } from '../../test/utils'
import { Ascii } from './ascii'

beforeAll(() => {
  setupHappyDom()
})

describe('Ascii Component', () => {
  test('renders basic text', async () => {
    const { stdout, cleanup, waitForRender, waitForNextRender } = renderForTest(<Ascii text="Hi" />)
    await waitForRender()
    await waitForNextRender() // Wait for figlet async callback to complete
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders with color', async () => {
    const { stdout, cleanup, waitForRender, waitForNextRender } = renderForTest(<Ascii text="Hi" color="cyan" />)
    await waitForRender()
    await waitForNextRender() // Wait for figlet async callback to complete
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })
})
