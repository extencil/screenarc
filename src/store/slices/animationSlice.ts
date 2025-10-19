import type { AnimationState, AnimationActions, Slice, MotionBlurSettings, ZoomAnimationSettings } from '../../types'
import { ZOOM } from '../../lib/constants'
import { SPRING_PHYSICS_PRESETS } from '../../lib/anim'

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
    ...SPRING_PHYSICS_PRESETS.default,
    transitionDuration: 0.5, // Default duration for cursor springiness
  },
  zoomAnimation: {
    style: 'default',
    ...SPRING_PHYSICS_PRESETS.default,
    transitionDuration: ZOOM.SPEED_OPTIONS[ZOOM.DEFAULT_SPEED as keyof typeof ZOOM.SPEED_OPTIONS],
  },
}

export const createAnimationSlice: Slice<AnimationState, AnimationActions> = (set) => ({
  ...initialAnimationState,
  updateMotionBlur: (settings: Partial<MotionBlurSettings>) =>
    set((state) => {
      Object.assign(state.motionBlur, settings)
    }),
  updateCursorAnimation: (settings: Partial<ZoomAnimationSettings>) =>
    set((state) => {
      // If a preset style is being set, apply its physics values
      if (settings.style && SPRING_PHYSICS_PRESETS[settings.style]) {
        const { mass, tension, friction } = SPRING_PHYSICS_PRESETS[settings.style]
        Object.assign(state.cursorAnimation, { mass, tension, friction })
      }
      // Apply any other individual property overrides
      Object.assign(state.cursorAnimation, settings)
      // If individual properties are changed, mark style as 'custom'
      if (
        (settings.mass !== undefined ||
          settings.tension !== undefined ||
          settings.friction !== undefined ||
          settings.transitionDuration !== undefined) &&
        settings.style === undefined
      ) {
        state.cursorAnimation.style = 'custom'
      }
    }),
  updateZoomAnimation: (settings: Partial<ZoomAnimationSettings>) =>
    set((state) => {
      if (settings.style && SPRING_PHYSICS_PRESETS[settings.style]) {
        const { mass, tension, friction } = SPRING_PHYSICS_PRESETS[settings.style]
        Object.assign(state.zoomAnimation, { mass, tension, friction })
      }
      Object.assign(state.zoomAnimation, settings)
      if (
        (settings.mass !== undefined ||
          settings.tension !== undefined ||
          settings.friction !== undefined ||
          settings.transitionDuration !== undefined) &&
        settings.style === undefined
      ) {
        state.zoomAnimation.style = 'custom'
      }
    }),
})
