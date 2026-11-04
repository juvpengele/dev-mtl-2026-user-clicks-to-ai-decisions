import { animate, type Easing } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useSlide } from '../deck/SlideContext'

/**
 * A number that animates toward `target`. Drives typewriters, counters and the
 * N+1 cascade. Respects static rendering and reduced motion (jumps straight to target).
 */
export function useCountTo(
  target: number,
  opts: { from?: number; duration?: number; backDuration?: number; delay?: number; ease?: Easing | Easing[] } = {},
) {
  const { initial, isStatic, reduced, dir } = useSlide()
  const { from = 0, duration = 1, backDuration = 0.35, delay = 0, ease = 'linear' } = opts
  const [value, setValue] = useState(() => (initial === false ? target : from))
  const current = useRef(value)

  useEffect(() => {
    if (isStatic || reduced) {
      current.current = target
      setValue(target)
      return
    }
    const forward = target > current.current
    const controls = animate(current.current, target, {
      duration: forward && dir > 0 ? duration : backDuration,
      delay: forward && dir > 0 ? delay : 0,
      ease: forward ? ease : 'easeOut',
      onUpdate: (v) => {
        current.current = v
        setValue(v)
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, isStatic, reduced])

  return value
}
