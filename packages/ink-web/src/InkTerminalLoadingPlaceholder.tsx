import React from 'react'
import { getTerminalHeight } from './utils'

export type LoadingPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
export type LoadingType = 'spinner' | 'skeleton' | 'progress' | 'none'

export interface LoadingConfig {
  type: LoadingType
  position?: LoadingPosition
}

export type LoadingOption = LoadingType | LoadingConfig | React.ReactNode

export interface InkTerminalLoadingPlaceholderProps {
  /** Number of rows to display. Should match the rows prop of InkTerminalBox. */
  rows?: number
  /** Loading indicator configuration */
  loading?: LoadingOption
  className?: string
}

const positionStyles: Record<LoadingPosition, React.CSSProperties> = {
  'center': { alignItems: 'center', justifyContent: 'center' },
  'top-left': { alignItems: 'flex-start', justifyContent: 'flex-start', padding: '16px' },
  'top-right': { alignItems: 'flex-start', justifyContent: 'flex-end', padding: '16px' },
  'bottom-left': { alignItems: 'flex-end', justifyContent: 'flex-start', padding: '16px' },
  'bottom-right': { alignItems: 'flex-end', justifyContent: 'flex-end', padding: '16px' },
}

/**
 * SSR-safe loading placeholder for InkTerminalBox.
 * Use this as the loading fallback with Next.js dynamic imports to prevent
 * animation resets during hydration.
 */
export const InkTerminalLoadingPlaceholder: React.FC<InkTerminalLoadingPlaceholderProps> = ({
  rows = 15,
  loading = 'none',
  className = ''
}) => {
  const height = rows ? getTerminalHeight(rows) : undefined

  // Resolve loading config
  let type: LoadingType = 'spinner'
  let position: LoadingPosition = 'center'
  let customElement: React.ReactNode = null

  if (typeof loading === 'string' && (loading === 'spinner' || loading === 'skeleton' || loading === 'progress' || loading === 'none')) {
    type = loading
  } else if (loading && typeof loading === 'object' && 'type' in loading && !React.isValidElement(loading)) {
    const config = loading as LoadingConfig
    type = config.type
    position = config.position || 'center'
  } else if (React.isValidElement(loading)) {
    customElement = loading
  }

  const posStyle = positionStyles[position]

  return (
    <div
      className={`ink-terminal-box ${className}`}
      style={{
        height: height ? `${height}px` : undefined,
        position: 'relative',
        background: '#000000'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        ...posStyle,
      }}>
        {customElement || <LoadingIndicator type={type} />}
      </div>
    </div>
  )
}

function LoadingIndicator({ type }: { type: LoadingType }) {
  switch (type) {
    case 'spinner':
      return <Spinner />
    case 'skeleton':
      return <Skeleton />
    case 'progress':
      return <Progress />
    case 'none':
      return null
    default:
      return <Spinner />
  }
}

function Spinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        color: 'rgba(255, 255, 255, 0.5)',
        animation: 'ink-spin 1s linear infinite'
      }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ height: '16px', width: '300px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', animation: 'ink-pulse 2s ease-in-out infinite' }} />
      <div style={{ height: '16px', width: '250px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', animation: 'ink-pulse 2s ease-in-out infinite' }} />
      <div style={{ height: '16px', width: '200px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', animation: 'ink-pulse 2s ease-in-out infinite' }} />
    </div>
  )
}

function Progress() {
  return (
    <div style={{
      width: '200px',
      height: '8px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <div style={{
        height: '100%',
        width: '100%',
        background: 'rgba(255,255,255,0.8)',
        animation: 'ink-progress-loop 1.5s ease-out infinite'
      }} />
    </div>
  )
}

export default InkTerminalLoadingPlaceholder
