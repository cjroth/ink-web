import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { Text } from 'ink'
import { setupHappyDom, renderForTest } from '../../test/utils'
import { Modal } from './modal'

beforeAll(() => {
  setupHappyDom()
})

describe('Modal', () => {
  test('renders children', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Modal>
        <Text>Modal content here</Text>
      </Modal>
    )
    await waitForRender()
    expect(stdout.output()).toContain('Modal content here')
    cleanup()
  })

  test('renders with title', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Modal title="My Modal">
        <Text>Content</Text>
      </Modal>
    )
    await waitForRender()
    expect(stdout.output()).toContain('My Modal')
    cleanup()
  })

  test('renders without title', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Modal>
        <Text>Just content</Text>
      </Modal>
    )
    await waitForRender()
    expect(stdout.output()).toContain('Just content')
    cleanup()
  })

  test('renders with custom border color', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <Modal borderColor="red" title="Red Modal">
        <Text>Content</Text>
      </Modal>
    )
    await waitForRender()
    expect(stdout.output()).toContain('Red Modal')
    cleanup()
  })
})
