import { InkTerminalLoadingPlaceholder } from 'ink-web'
import 'ink-web/css'

export function InkDemoSkeleton() {
  return <InkTerminalLoadingPlaceholder rows={15} loading={{ type: 'skeleton', position: 'top-left' }} />
}
