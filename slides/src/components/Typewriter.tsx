import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { useSlide } from '../deck/SlideContext'
import { useCountTo } from './useCountTo'

/**
 * Character-by-character typing. Hidden characters keep their space so the
 * layout never jumps. Goes back by "deleting" quickly.
 */
export function Typewriter({
  text,
  at = 0,
  delay = 0,
  cps = 32,
  cursor = true,
  className,
  style,
}: {
  text: string
  at?: number
  delay?: number
  /** Characters per second. */
  cps?: number
  cursor?: boolean
  className?: string
  style?: CSSProperties
}) {
  const { step, isStatic } = useSlide()
  const target = step >= at ? text.length : 0
  const n = Math.round(useCountTo(target, { duration: text.length / cps, delay, backDuration: 0.3 }))
  const typing = n > 0 && n < text.length
  const showCursor = cursor && !isStatic && step >= at

  return (
    <span className={className} style={style}>
      {text.slice(0, n)}
      {showCursor && (
        <motion.span
          className="caret"
          animate={typing ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
          transition={typing ? { duration: 0 } : { duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        />
      )}
      <span style={{ visibility: 'hidden' }}>{text.slice(n)}</span>
    </span>
  )
}
