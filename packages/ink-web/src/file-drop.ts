import { useEffect } from 'react'
import { useStdin } from 'ink'

export interface DroppedFile {
  name: string
  content: string
  type: string
  size: number
}

export const FILE_DROP_EVENT = 'file-drop'

/**
 * Hook that listens for file drop events on the terminal container.
 * Files are read as text and delivered via a custom event on stdin.
 *
 * The drop listeners are attached by mountInkInXterm on the container element.
 * This hook simply subscribes to the resulting 'file-drop' events on stdin.
 */
export function useFileDrop(callback: (file: DroppedFile) => void): void {
  const { stdin } = useStdin()

  useEffect(() => {
    const handler = (...args: unknown[]) => {
      const file = args[0] as DroppedFile
      callback(file)
    }

    const emitter = stdin as unknown as {
      on: (event: string, listener: (...args: unknown[]) => void) => void
      off: (event: string, listener: (...args: unknown[]) => void) => void
    }

    emitter.on(FILE_DROP_EVENT, handler)
    return () => {
      emitter.off(FILE_DROP_EVENT, handler)
    }
  }, [stdin, callback])
}
