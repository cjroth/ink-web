interface StreamPart {
  type: 'tool' | 'text'
  content?: string
  toolName?: string
  state?: 'call' | 'result' | 'error'
  args?: any
  result?: any
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  parts?: StreamPart[]
}
