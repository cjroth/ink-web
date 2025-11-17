// Minimal os shim for browser
export const EOL = '\n'
export const platform = () => 'browser'
export const type = () => 'Browser'
export const arch = () => 'x64'
export const release = () => '1.0.0'

export default {
  EOL,
  platform,
  type,
  arch,
  release,
}



