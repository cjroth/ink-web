export class BufferShim {
  static isBuffer(value: unknown): boolean {
    return typeof value === 'object' && value !== null && typeof (value as any).length === 'number'
  }
}

export const Buffer = BufferShim as unknown as typeof globalThis extends { Buffer: infer T } ? T : typeof BufferShim

export default { Buffer }
