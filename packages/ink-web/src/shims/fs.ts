export function existsSync(_path: string): boolean {
  return false
}

export function readFileSync(_path: string, _encoding?: BufferEncoding | 'utf8'): string {
  return ''
}

export function writeFileSync(_path: string, _data: string): void {}

export function mkdirSync(_path: string, _options?: any): void {}

export function unlinkSync(_path: string): void {}

export default { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync }
