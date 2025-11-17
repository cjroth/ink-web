declare module 'chalk-orig' {
  import type { Chalk, ChalkInstance } from 'chalk'
  const chalk: ChalkInstance & Chalk
  export default chalk
  export * from 'chalk'
}

