import type { AnimationState, AnimationActions, Slice, AnimationStyle, MotionBlurSettings } from '../../types'

export const ANIMATION_PRESETS: Record<string, Omit<AnimationStyle, 'style'>> = {
  default: { mass: 1, tension: 170, friction: 26 },
  gentle: { mass: 1, tension: 120, friction: 14 },
  wobbly: { mass: 1, tension: 180, friction: 12 },
  stiff: { mass: 1, tension: 210, friction: 20 },
  slow: { mass: 1, tension: 280, friction: 60 },
  custom: { mass: 1, tension: 170, friction: 26 }, // Placeholder for custom values
}

export const initialAnimationState: AnimationState = {
  motionBlur: {
    enabled: false,
    amount: 50, // Master amount
    cursor: 70, // Percentage of master
    zoom: 100, // Percentage of master
    pan: 100, // Percentage of master
  },
  cursorAnimation: {
    style: 'default',
    ...ANIMATION_PRESETS.default,
  },
  zoomAnimation: {
    style: 'default',
    ...ANIMATION_PRESETS.default,
  },
}

export const createAnimationSlice: Slice<AnimationState, AnimationActions> = (set) => ({
  ...initialAnimationState,
  updateMotionBlur: (settings: Partial<MotionBlurSettings>) =>
    set((state) => {
      Object.assign(state.motionBlur, settings)
    }),
  updateCursorAnimation: (settings: Partial<AnimationStyle>) =>
    set((state) => {
      // If a preset style is being set, apply its values
      if (settings.style && ANIMATION_PRESETS[settings.style]) {
        Object.assign(state.cursorAnimation, ANIMATION_PRESETS[settings.style])
      }
      // Apply any other individual property overrides
      Object.assign(state.cursorAnimation, settings)
      // If individual properties are changed, mark style as 'custom'
      if (
        (settings.mass !== undefined || settings.tension !== undefined || settings.friction !== undefined) &&
        settings.style === undefined
      ) {
        state.cursorAnimation.style = 'custom'
      }
    }),
  updateZoomAnimation: (settings: Partial<AnimationStyle>) =>
    set((state) => {
      if (settings.style && ANIMATION_PRESETS[settings.style]) {
        Object.assign(state.zoomAnimation, ANIMATION_PRESETS[settings.style])
      }
      Object.assign(state.zoomAnimation, settings)
      if (
        (settings.mass !== undefined || settings.tension !== undefined || settings.friction !== undefined) &&
        settings.style === undefined
      ) {
        state.zoomAnimation.style = 'custom'
      }
    }),
})