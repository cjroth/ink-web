import EventEmitter from './events'

export class Stream extends EventEmitter {}

export class Writable extends Stream {
  writable = true
  write(chunk: unknown, _encoding?: string, cb?: () => void): boolean {
    const data = typeof chunk === 'string' ? chunk : String(chunk)
    this.emit('data', data)
    if (cb) cb()
    return true
  }
  end(): void {
    this.emit('end')
  }
  cork(): void {}
  uncork(): void {}
  setDefaultEncoding(_enc: string): this {
    return this
  }
}

export class Readable extends Stream {
  readable = true
  setEncoding(_enc: string): this {
    return this
  }
  resume(): this {
    return this
  }
  pause(): this {
    return this
  }
  pipe<T>(_dest: T): T {
    return _dest
  }
  unpipe(): this {
    return this
  }
}

export class PassThrough extends Writable {}

export default { Stream, Writable, Readable, PassThrough }
