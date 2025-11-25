import type { ReactNode } from 'react'
import { Transform } from 'ink-web/bundled'

export type GradientName =
  | 'cristal'
  | 'teen'
  | 'mind'
  | 'morning'
  | 'vice'
  | 'passion'
  | 'fruit'
  | 'instagram'
  | 'atlas'
  | 'retro'
  | 'summer'
  | 'pastel'
  | 'rainbow'

export interface GradientProps {
  children: ReactNode
  /**
   * The name of a built-in gradient.
   * Mutually exclusive with `colors`.
   */
  name?: GradientName
  /**
   * Array of hex color strings to create a custom gradient.
   * Mutually exclusive with `name`.
   */
  colors?: string[]
}

interface RGB {
  r: number
  g: number
  b: number
}

// Built-in gradient presets
const GRADIENTS: Record<GradientName, string[]> = {
  cristal: ['#bdfff3', '#4ac29a'],
  teen: ['#77a1d3', '#79cbca', '#e684ae'],
  mind: ['#473b7b', '#3584a7', '#30d2be'],
  morning: ['#ff5f6d', '#ffc371'],
  vice: ['#5ee7df', '#b490ca'],
  passion: ['#f43b47', '#453a94'],
  fruit: ['#ff4e50', '#f9d423'],
  instagram: ['#833ab4', '#fd1d1d', '#fcb045'],
  atlas: ['#feac5e', '#c779d0', '#4bc0c8'],
  retro: ['#3f51b1', '#5a55ae', '#7b5fac', '#8f6aae', '#a86aa4', '#cc6b8e', '#f18271', '#f3a469', '#f7c978'],
  summer: ['#fdbb2d', '#22c1c3'],
  rainbow: ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'],
  pastel: ['#74ebd5', '#ACB6E5'],
}

/**
 * Parse a hex color string to RGB values
 */
function hexToRgb(hex: string): RGB {
  const normalized = hex.replace('#', '')
  const r = parseInt(normalized.substring(0, 2), 16)
  const g = parseInt(normalized.substring(2, 4), 16)
  const b = parseInt(normalized.substring(4, 6), 16)
  return { r, g, b }
}

/**
 * Convert RGB values to ANSI 24-bit color escape code
 */
function rgbToAnsi(rgb: RGB): string {
  return `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m`
}

/**
 * Linear interpolation between two values
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Interpolate between two RGB colors
 */
function interpolateColor(color1: RGB, color2: RGB, t: number): RGB {
  return {
    r: Math.round(lerp(color1.r, color2.r, t)),
    g: Math.round(lerp(color1.g, color2.g, t)),
    b: Math.round(lerp(color1.b, color2.b, t)),
  }
}

/**
 * Strip ANSI escape codes from a string
 */
function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, '')
}

/**
 * Generate an array of interpolated colors for a gradient
 */
function generateGradient(colors: string[], steps: number): RGB[] {
  if (colors.length === 0) {
    throw new Error('At least one color is required')
  }

  if (colors.length === 1) {
    const singleColor = hexToRgb(colors[0])
    return Array(steps).fill(singleColor)
  }

  const rgbColors = colors.map(hexToRgb)
  const result: RGB[] = []
  const segmentLength = steps / (rgbColors.length - 1)

  for (let i = 0; i < steps; i++) {
    const segmentIndex = Math.min(Math.floor(i / segmentLength), rgbColors.length - 2)
    const segmentProgress = (i % segmentLength) / segmentLength
    const color = interpolateColor(rgbColors[segmentIndex], rgbColors[segmentIndex + 1], segmentProgress)
    result.push(color)
  }

  return result
}

/**
 * Apply gradient to text (multiline mode - gradient applies horizontally per line)
 */
function applyGradient(text: string, colors: string[]): string {
  const cleanText = stripAnsi(text)
  const lines = cleanText.split('\n')
  const maxLength = Math.max(...lines.map((line) => line.length))

  if (maxLength === 0) {
    return text
  }

  const gradientColors = generateGradient(colors, maxLength)
  const result: string[] = []

  for (const line of lines) {
    let coloredLine = ''
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const color = gradientColors[i]
      coloredLine += rgbToAnsi(color) + char
    }
    // Reset color at end of line
    if (line.length > 0) {
      coloredLine += '\x1b[0m'
    }
    result.push(coloredLine)
  }

  return result.join('\n')
}

/**
 * Gradient component for Ink
 *
 * Apply beautiful color gradients to terminal text. Supports both built-in
 * gradient presets and custom color arrays.
 *
 * @example
 * ```tsx
 * // Using a built-in gradient
 * <Gradient name="rainbow">
 *   <Text>Hello World!</Text>
 * </Gradient>
 *
 * // Using custom colors
 * <Gradient colors={['#ff0000', '#00ff00', '#0000ff']}>
 *   <Text>Custom Gradient</Text>
 * </Gradient>
 * ```
 */
export const Gradient = ({ children, name, colors }: GradientProps) => {
  if (name && colors) {
    throw new Error('The `name` and `colors` props are mutually exclusive')
  }

  if (!name && !colors) {
    throw new Error('Either `name` or `colors` prop must be provided')
  }

  const gradientColors = name ? GRADIENTS[name] : colors!

  return (
    <Transform transform={(text: string) => applyGradient(text, gradientColors)}>
      {children}
    </Transform>
  )
}

export default Gradient
