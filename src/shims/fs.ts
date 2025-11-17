export function existsSync(_path: string): boolean {
  return false
}

export function readFileSync(_path: string, _encoding?: BufferEncoding | 'utf8'): string {
  return ''
}

export default { existsSync, readFileSync }
