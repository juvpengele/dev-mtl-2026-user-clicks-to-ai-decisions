import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Easing, Transition } from 'motion/react'

/**
 * Spring presets. Everything in the deck moves with springs; tweak them here.
 * Remotion-like feel: snappy with a little overshoot, settling fast.
 */
const SPRINGS = {
  snappy: { stiffness: 420, damping: 34, mass: 1 },
  soft: { stiffness: 170, damping: 24, mass: 1 },
  bouncy: { stiffness: 320, damping: 16, mass: 1 },
  slow: { stiffness: 55, damping: 18, mass: 1.2 },
  draw: { stiffness: 40, damping: 16, mass: 1 },
} as const

export type SpringName = keyof typeof SPRINGS

export interface Motionkit {
  /** Spring transition. Delays only apply when moving forward so "back" reverses instantly. */
  spring: (name?: SpringName, delay?: number) => Transition
  /** Stagger interval in seconds (0 when static / reduced motion). */
  stagger: (seconds: number) => number
  /** Forward-only delay helper. */
  delay: (seconds: number) => number
  /** Fixed-duration tween for timed sequences (a dot travelling, bars growing). Quick when going back. */
  tween: (duration: number, delay?: number, ease?: Easing) => Transition
}

export interface SlideState {
  /** Current step on this slide (0-based). */
  step: number
  /** 1 when we arrived by going forward, -1 going backward. */
  dir: 1 | -1
  /** Pass to motion `initial`. False when entering backwards or rendering statically: no replay. */
  initial: false | 'hidden'
  /** Thumbnails / presenter previews: render final values instantly, no loops. */
  isStatic: boolean
  /** prefers-reduced-motion: no movement, short fades only. */
  reduced: boolean
  t: Motionkit
}

const Ctx = createContext<SlideState | null>(null)

export function SlideProvider(props: {
  step: number
  dir: 1 | -1
  enteredBackward: boolean
  isStatic: boolean
  reduced: boolean
  children: ReactNode
}) {
  const { step, dir, enteredBackward, isStatic, reduced } = props
  const value = useMemo<SlideState>(() => {
    const instant = isStatic
    const t: Motionkit = {
      spring: (name = 'soft', delay = 0) => {
        if (instant) return { duration: 0 }
        const d = dir > 0 ? delay : 0
        if (reduced) return { duration: 0.2, ease: 'easeOut', delay: d * 0.25 }
        return { type: 'spring', ...SPRINGS[name], delay: d }
      },
      stagger: (s) => (instant || reduced ? 0 : s),
      delay: (s) => (instant || dir < 0 ? 0 : reduced ? s * 0.25 : s),
      tween: (duration, delay = 0, ease = 'easeInOut') => {
        if (instant) return { duration: 0 }
        if (dir < 0) return { duration: 0.3, ease: 'easeOut' }
        if (reduced) return { duration: 0.2, ease: 'easeOut', delay: delay * 0.25 }
        return { duration, delay, ease }
      },
    }
    return {
      step,
      dir,
      initial: enteredBackward || isStatic ? false : 'hidden',
      isStatic,
      reduced,
      t,
    }
  }, [step, dir, enteredBackward, isStatic, reduced])
  return <Ctx.Provider value={value}>{props.children}</Ctx.Provider>
}

export function useSlide(): SlideState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useSlide() must be used inside a slide')
  return v
}

/** Shorthand: "shown" once the slide reached `at`, else "hidden". */
export function useShown(at: number) {
  return useSlide().step >= at ? 'shown' : 'hidden'
}
