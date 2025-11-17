export const cwd = () => '/'
export const env: Record<string, string | undefined> = typeof window !== 'undefined' ? (window as any).__ENV__ ?? {} : {}
export default { cwd, env }
