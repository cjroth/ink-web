import type { FsAPI } from '@/filesystem/types'
import { PromptBuilder } from '@/runner/lib/prompt-builder'
import { stepCountIs, streamText, type ToolSet } from 'ai'
import { useEffect, useReducer } from 'react'
import { useInk } from '../src/context'
import { LoadingIndicator } from './loading-indicator'
import { StreamPartsDisplay } from './stream-parts-display'

type LanguageModel = Parameters<typeof streamText>[0]['model']

interface AppProps {
  provider: (modelId: string) => LanguageModel
  defaultModel: string
  fs: FsAPI
  tools?: ToolSet
  providerName?: 'ollama' | 'openrouter'
  apiKeyPresent?: boolean
}

export const App = ({ provider, defaultModel, fs, tools, providerName, apiKeyPresent }: AppProps) => {
  const { Box, Text, useApp, useInput, TextInput } = useInk()

  interface AppState {
    messages: Message[]
    input: string
    isLoading: boolean
    streamingParts: StreamPart[]
    agentsContent: string | null
    agentsWarning: boolean
    apiKeyMissing: boolean
  }

  type Action =
    | { type: 'USER_INPUT_CHANGED'; input: string }
    | { type: 'USER_SUBMIT'; userMessage: Message }
    | { type: 'STREAM_PARTS_UPDATED'; parts: StreamPart[] }
    | { type: 'ASSISTANT_RESPONSE'; assistantMessage: Message }
    | { type: 'AGENTS_CONTENT_LOADED'; content: string }
    | { type: 'AGENTS_WARNING_SHOWN' }
    | { type: 'API_KEY_MISSING_DETECTED' }
    | { type: 'SET_LOADING'; isLoading: boolean }

  const initialState: AppState = {
    messages: [],
    input: '',
    isLoading: false,
    streamingParts: [],
    agentsContent: null,
    agentsWarning: false,
    apiKeyMissing: false,
  }

  const reducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
      case 'USER_INPUT_CHANGED':
        return { ...state, input: action.input }
      case 'USER_SUBMIT':
        return {
          ...state,
          messages: [...state.messages, action.userMessage],
          input: '',
          isLoading: true,
          streamingParts: [],
        }
      case 'STREAM_PARTS_UPDATED':
        return { ...state, streamingParts: action.parts }
      case 'ASSISTANT_RESPONSE':
        return {
          ...state,
          messages: [...state.messages, action.assistantMessage],
          streamingParts: [],
          isLoading: false,
        }
      case 'AGENTS_CONTENT_LOADED':
        return { ...state, agentsContent: action.content, agentsWarning: false }
      case 'AGENTS_WARNING_SHOWN':
        return { ...state, agentsWarning: true }
      case 'API_KEY_MISSING_DETECTED':
        return { ...state, apiKeyMissing: true }
      case 'SET_LOADING':
        return { ...state, isLoading: action.isLoading }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  const { exit } = useApp()

  useEffect(() => {
    const isOllama = providerName === 'ollama'
    const hasKey = apiKeyPresent !== false
    if (!isOllama && !hasKey) dispatch({ type: 'API_KEY_MISSING_DETECTED' })

    async function loadAgents() {
      const pb = new PromptBuilder(fs, '.')
      const { hasAgents, content } = await pb.checkAgentsFile()
      if (hasAgents && content) {
        dispatch({ type: 'AGENTS_CONTENT_LOADED', content })
      } else {
        dispatch({ type: 'AGENTS_WARNING_SHOWN' })
      }
    }

    async function dumpSystemPrompt() {
      try {
        const pb = new PromptBuilder(fs, '.')
        const systemPrompt = await pb.buildSystemPrompt()
        await fs.mkdir('.agent', { recursive: true })
        await fs.writeFile('.agent/context.md', systemPrompt)
      } catch (error) {
        console.error('Failed to dump system prompt:', error)
      }
    }

    loadAgents()
    dumpSystemPrompt()
  }, [])

  useInput((_input: string, key) => {
    if (key.escape) {
      exit()
    }
  })

  const handleSubmit = async (value: string) => {
    if (!value.trim()) return

    const userMessage: Message = { role: 'user', content: value }
    dispatch({ type: 'USER_SUBMIT', userMessage })

    try {
      const systemMessage = state.agentsContent
        ? {
            role: 'system' as const,
            content: state.agentsContent + '\n\nIMPORTANT: After using any tools, always provide a helpful text response explaining what you found or accomplished.',
          }
        : {
            role: 'system' as const,
            content: 'IMPORTANT: After using any tools, always provide a helpful text response explaining what you found or accomplished.',
          }

      const allMessages = [systemMessage, ...state.messages, userMessage]

      const result = streamText({
        model: provider(defaultModel),
        messages: allMessages,
        tools: tools,
        stopWhen: stepCountIs(5),
      })

      const { fullStream } = result

      // Clear previous log and start fresh
      await fs.mkdir('.agent', { recursive: true })
      await fs.writeFile('.agent/parts.log', `=== New request: ${new Date().toISOString()} ===\n`)

      // Track all parts in order
      const allParts: StreamPart[] = []
      let currentText = ''

      // Handle all stream parts
      for await (const part of fullStream) {
        const logEntry = `[${new Date().toISOString()}] Stream part: ${part.type} - ${JSON.stringify(part, null, 2)}\n`
        const prev = (await fs.access('.agent/stream.log')) ? ((await fs.readFile('.agent/stream.log', 'text')) as string) : ''
        await fs.writeFile('.agent/stream.log', prev + logEntry)
        console.log('Stream part:', part.type, part)

        switch (part.type) {
          case 'text-delta':
            // If we have accumulated text, update the last text part or create new one
            currentText += (part as any).textDelta || (part as any).text || ''
            const lastPart = allParts[allParts.length - 1]
            if (lastPart && lastPart.type === 'text') {
              lastPart.content = currentText
            } else {
              allParts.push({ type: 'text', content: currentText })
            }
            dispatch({ type: 'STREAM_PARTS_UPDATED', parts: [...allParts] })
            break

          case 'tool-call':
            // Save any accumulated text first
            if (currentText) {
              const lastTextPart = allParts[allParts.length - 1]
              if (!lastTextPart || lastTextPart.type !== 'text') {
                allParts.push({ type: 'text', content: currentText })
              }
              currentText = ''
            }
            allParts.push({
              type: 'tool',
              toolName: (part as any).toolName,
              args: (part as any).args || (part as any).input,
              state: 'call',
            })
            dispatch({ type: 'STREAM_PARTS_UPDATED', parts: [...allParts] })
            break

          case 'tool-result':
            // Update the corresponding tool call
            const toolIndex = [...allParts].reverse().findIndex((p) => p.type === 'tool' && p.toolName === (part as any).toolName && p.state === 'call')
            const actualIndex = toolIndex !== -1 ? allParts.length - 1 - toolIndex : -1
            if (actualIndex !== -1) {
              allParts[actualIndex].state = 'result'
              allParts[actualIndex].result = (part as any).result || (part as any).output
              dispatch({ type: 'STREAM_PARTS_UPDATED', parts: [...allParts] })
            }
            break

          case 'tool-error':
            // Update the corresponding tool call with error
            const errorIdx = [...allParts].reverse().findIndex((p) => p.type === 'tool' && p.toolName === (part as any).toolName && p.state === 'call')
            const errorIndex = errorIdx !== -1 ? allParts.length - 1 - errorIdx : -1
            if (errorIndex !== -1) {
              allParts[errorIndex].state = 'error'
              allParts[errorIndex].result = (part as any).error
              dispatch({ type: 'STREAM_PARTS_UPDATED', parts: [...allParts] })
            }
            break

          case 'finish':
          case 'finish-step':
            console.log('Stream finished:', part.type)
            break

          case 'error':
            console.error('Stream error:', part)
            break
        }
      }

      // Compile full text response from text parts
      const fullResponse = allParts
        .filter((p) => p.type === 'text')
        .map((p) => p.content)
        .join('')

      dispatch({
        type: 'ASSISTANT_RESPONSE',
        assistantMessage: {
          role: 'assistant',
          content: fullResponse,
          parts: allParts.length > 0 ? allParts : undefined,
        },
      })
    } catch (error) {
      dispatch({
        type: 'ASSISTANT_RESPONSE',
        assistantMessage: {
          role: 'assistant',
          content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      })
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false })
    }
  }

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">
        Thoughtful 👻
      </Text>
      {state.agentsWarning && (
        <Box marginTop={1}>
          <Text color="#ff8c00">No AGENTS.md detected.</Text>
        </Box>
      )}
      {state.agentsContent && (
        <Box marginTop={1} flexDirection="column">
          <Text color="blue">Loaded AGENTS.md</Text>
          <Text color="gray">Provider: {process.env.PROVIDER || 'openrouter'}</Text>
          <Text color="gray">Model: {defaultModel}</Text>
        </Box>
      )}
      {state.apiKeyMissing && (
        <Box marginTop={1}>
          <Text color="red">Warning: OPENROUTER_API_KEY not found in .env file.</Text>
        </Box>
      )}
      <Box flexDirection="column" marginTop={1}>
        {state.messages.map((msg, index) => (
          <Box key={index} marginBottom={1} flexDirection="column">
            {msg.role === 'user' ? (
              <Text color="#999966">{msg.content}</Text>
            ) : msg.parts && msg.parts.length > 0 ? (
              <StreamPartsDisplay parts={msg.parts} isStreaming={false} />
            ) : (
              <Text color="white" bold>
                {msg.content}
              </Text>
            )}
          </Box>
        ))}

        {state.streamingParts.length > 0 && (
          <Box marginBottom={1}>
            <StreamPartsDisplay parts={state.streamingParts} isStreaming={true} />
          </Box>
        )}

        {state.isLoading && state.streamingParts.length === 0 && (
          <Box marginBottom={1}>
            <LoadingIndicator />
          </Box>
        )}
      </Box>
      <Box marginTop={1}>
        <Text bold color="green">
          &gt;{' '}
        </Text>
        <TextInput value={state.input} onChange={(val: string) => dispatch({ type: 'USER_INPUT_CHANGED', input: val })} onSubmit={handleSubmit} placeholder="Type your message..." />
      </Box>
    </Box>
  )
}
