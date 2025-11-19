// Minimal fs shim for browser - most operations are no-ops since fs doesn't make sense in browser
export const readFileSync = () => ''
export const writeFileSync = () => {}
export const existsSync = () => false
export const statSync = () => ({ isFile: () => false, isDirectory: () => false })
export const readdirSync = () => []
export const mkdirSync = () => {}
export const rmdirSync = () => {}
export const unlinkSync = () => {}

export default {
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
  readdirSync,
  mkdirSync,
  rmdirSync,
  unlinkSync,
}

