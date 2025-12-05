import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { setupHappyDom, renderForTest } from '../../test/utils'
import { Link } from './link'

beforeAll(() => {
  setupHappyDom()
})

describe('Link Component', () => {
  test('renders link with text', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Link url="https://github.com">GitHub</Link>
    )
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })

  test('renders with different URL', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Link url="https://example.com">Example</Link>
    )
    await waitForRender()
    expect(stdout.output()).toMatchSnapshot()
    cleanup()
  })
})
