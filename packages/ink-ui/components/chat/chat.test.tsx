import { describe, expect, test, beforeAll } from 'bun:test'
import React from 'react'
import { setupHappyDom, renderForTest } from '../../test/utils'
import { ChatPanel } from './chat'
import type { ChatMessage, ToolCallInfo } from './chat'

beforeAll(() => {
  setupHappyDom()
})

const sampleMessages: ChatMessage[] = [
  { id: '1', role: 'user', content: 'Hello' },
  { id: '2', role: 'assistant', content: 'Hi there! How can I help?' },
]

describe('ChatPanel', () => {
  test('renders messages', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <ChatPanel messages={sampleMessages} onSendMessage={() => {}} />
    )
    await waitForRender()
    const output = stdout.output()
    expect(output).toContain('Hello')
    expect(output).toContain('Hi there! How can I help?')
    cleanup()
  })

  test('renders empty state', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <ChatPanel messages={[]} onSendMessage={() => {}} />
    )
    await waitForRender()
    expect(stdout.output()).toContain('Type a message...')
    cleanup()
  })

  test('shows streaming text', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <ChatPanel
        messages={sampleMessages}
        streamingText="I'm thinking about"
        onSendMessage={() => {}}
      />
    )
    await waitForRender()
    const output = stdout.output()
    expect(output).toContain("I'm thinking about")
    cleanup()
  })

  test('shows loading text', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <ChatPanel messages={sampleMessages} isLoading onSendMessage={() => {}} />
    )
    await waitForRender()
    expect(stdout.output()).toContain('Thinking...')
    cleanup()
  })

  test('shows custom loading text', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <ChatPanel
        messages={sampleMessages}
        isLoading
        loadingText="Processing..."
        onSendMessage={() => {}}
      />
    )
    await waitForRender()
    expect(stdout.output()).toContain('Processing...')
    cleanup()
  })

  test('shows tool calls', async () => {
    const toolCalls: ToolCallInfo[] = [
      { id: 'tc1', title: 'get_portfolio', status: 'in_progress' },
      { id: 'tc2', title: 'calculate_trades', status: 'completed' },
      { id: 'tc3', title: 'fetch_data', status: 'failed' },
    ]
    const { stdout, cleanup, waitForRender } = renderForTest(
      <ChatPanel
        messages={sampleMessages}
        activeToolCalls={toolCalls}
        onSendMessage={() => {}}
      />
    )
    await waitForRender()
    const output = stdout.output()
    expect(output).toContain('get_portfolio')
    expect(output).toContain('calculate_trades')
    expect(output).toContain('fetch_data')
    expect(output).toContain('\u280B') // in_progress spinner
    expect(output).toContain('\u2713') // completed check
    expect(output).toContain('\u2717') // failed x
    cleanup()
  })

  test('renders with custom placeholder', async () => {
    const { stdout, cleanup, waitForRender } = renderForTest(
      <ChatPanel messages={[]} onSendMessage={() => {}} placeholder="Ask me anything..." />
    )
    await waitForRender()
    expect(stdout.output()).toContain('Ask me anything...')
    cleanup()
  })
})
