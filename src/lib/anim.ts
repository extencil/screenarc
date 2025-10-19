import { ZoomAnimationSettings } from '../types'

/**
 * Calculates the position of a spring animation at a given time using physics-based easing.
 * Implements a damped harmonic oscillator model that can be underdamped, critically damped, or overdamped.
 *
 * @param {number} t - The normalized time value between 0 (start) and 1 (end).
 * @param {number} from - The starting value of the animation.
 * @param {number} to - The target value of the animation.
 * @param {SpringConfig} config - Configuration object containing spring physics parameters:
 *   - mass: The mass of the spring (affects inertia)
 *   - tension: The spring tension/stiffness (higher = stiffer spring)
 *   - friction: The damping/friction coefficient (higher = more damping)
 *   - transitionDuration: Total duration of the animation in seconds
 * @returns {number} The interpolated value between `from` and `to` at time `t`
 */
export function simulateSpring(t: number, from: number, to: number, config: ZoomAnimationSettings): number {
  const { mass, tension, friction, transitionDuration } = config
  // The provided formula logic expects duration in milliseconds for its internal calculation.
  const durationMs = transitionDuration * 1000
  const displacement = to - from

  // Calculate spring coefficients
  const w0 = Math.sqrt(tension / mass)
  const zeta = friction / (2 * Math.sqrt(tension * mass))

  // Clamp t to the [0, 1] range
  t = Math.max(0, Math.min(1, t))
  if (t === 1) return to // Ensure it ends exactly at the target value

  if (zeta < 1) {
    // Underdamped (oscillates)
    const wd = w0 * Math.sqrt(1 - zeta * zeta)
    const A = 1
    const B = (zeta * w0) / wd
    const envelope = Math.exp((-zeta * w0 * t * durationMs) / 1000)
    const phase = (wd * t * durationMs) / 1000
    return from + displacement * (1 - envelope * (A * Math.cos(phase) + B * Math.sin(phase)))
  } else if (zeta === 1) {
    // Critically damped
    const scaledTime = (w0 * t * durationMs) / 1000
    return from + displacement * (1 - (1 + scaledTime) * Math.exp(-scaledTime))
  } else {
    // Overdamped
    const r1 = -w0 * (zeta - Math.sqrt(zeta * zeta - 1))
    const r2 = -w0 * (zeta + Math.sqrt(zeta * zeta - 1))
    const A = r2 / (r2 - r1)
    const B = 1 - A
    const scaledTime = (t * durationMs) / 1000
    return from + displacement * (1 - A * Math.exp(r1 * scaledTime) - B * Math.exp(r2 * scaledTime))
  }
}

export const createSpringEasing = (
  from: number,
  to: number,
  config: ZoomAnimationSettings,
): ((t: number) => number) => {
  return (t: number) => simulateSpring(t, from, to, config)
}

// --- Standard Cubic Bezier Easing Functions ---

const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

const easeInOutQuint = (t: number): number => {
  if (t < 0.5) {
    return 16 * t * t * t * t * t
  } else {
    const f = 2 * t - 2
    return 0.5 * f * f * f * f * f + 1
  }
}

const easeOutQuint = (t: number): number => {
  return 1 - Math.pow(1 - t, 5)
}

// --- User-Friendly Animation Preset Maps ---

/**
 * Standard, curve-based easing functions for simple, predictable animations.
 * Used for UI effects like click ripples and cursor scaling.
 */
export const EASING_PRESETS: Record<string, { name: string; easing: (t: number) => number }> = {
  smooth: { name: 'Smooth', easing: easeOutQuint },
  balanced: { name: 'Balanced', easing: easeInOutQuint },
  dynamic: { name: 'Dynamic', easing: easeInOutCubic },
}

/**
 * Physics parameters for spring animations, used for natural, interruptible motion.
 * Used for camera movements (zoom/pan) and cursor tracking.
 */
export const SPRING_PHYSICS_PRESETS: Record<string, { name: string; mass: number; tension: number; friction: number }> =
  {
    default: { name: 'Default', mass: 1, tension: 170, friction: 26 },
    gentle: { name: 'Gentle', mass: 1, tension: 120, friction: 14 },
    wobbly: { name: 'Wobbly', mass: 1, tension: 180, friction: 12 },
    stiff: { name: 'Stiff', mass: 1, tension: 210, friction: 20 },
    slow: { name: 'Slow', mass: 1, tension: 280, friction: 60 },
  }
