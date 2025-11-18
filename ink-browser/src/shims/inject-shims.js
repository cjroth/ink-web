// This file is injected into the bundled version to provide shims
// It needs to be .js not .ts for esbuild inject to work properly

export { default as process } from './process.ts'
export { Stream, PassThrough } from './stream.ts'
export { EventEmitter } from './events.ts'
export { Buffer } from './buffer.ts'
export { default as os } from './os.ts'

