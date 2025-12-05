import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { setupHappyDom, renderForTest } from '../../test/utils'
import { Spinner } from './spinner'

beforeAll(() => {
  setupHappyDom()
})

describe('Spinner Component', () => {
  test('renders with default text', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(<Spinner />)
    await waitForRender()
    expect(stdout.output()).toContain('Loading')
    cleanup()
  })

  test('renders with custom text', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(<Spinner text="Processing..." />)
    await waitForRender()
    expect(stdout.output()).toContain('Processing...')
    cleanup()
  })

  test('renders with custom color', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(<Spinner color="cyan" text="Wait" />)
    await waitForRender()
    expect(stdout.output()).toContain('Wait')
    cleanup()
  })
})
