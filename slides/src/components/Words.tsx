import { motion, type Variants } from 'motion/react'
import type { CSSProperties } from 'react'
import { useSlide, type SpringName } from '../deck/SlideContext'

/**
 * Kinetic typography: words spring in one after another (rise + fade), and
 * reverse in the opposite order when going back.
 */
export function Words({
  text,
  at = 0,
  delay = 0,
  stagger = 0.09,
  spring = 'soft',
  className,
  style,
  highlight = {},
  from = 'up',
}: {
  text: string
  /** Step at which the words appear. */
  at?: number
  delay?: number
  stagger?: number
  spring?: SpringName
  className?: string
  style?: CSSProperties
  /** Map of word (without punctuation) → className, e.g. { works: 'accent' }. */
  highlight?: Record<string, string>
  from?: 'up' | 'down' | 'scale'
}) {
  const { step, initial, t } = useSlide()
  const words = text.split(' ')

  const hiddenWord =
    from === 'scale'
      ? { opacity: 0, scale: 1.6 }
      : { opacity: 0, y: from === 'up' ? '0.45em' : '-0.45em' }

  const parent: Variants = {
    shown: { transition: { staggerChildren: t.stagger(stagger), delayChildren: t.delay(delay) } },
    hidden: { transition: { staggerChildren: t.stagger(0.03), staggerDirection: -1 } },
  }
  const child: Variants = {
    hidden: hiddenWord,
    shown: { opacity: 1, y: 0, scale: 1 },
  }

  return (
    <motion.span
      className={className}
      style={{ display: 'block', ...style }}
      initial={initial}
      animate={step >= at ? 'shown' : 'hidden'}
      variants={parent}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className={`word ${highlight[w.replace(/[^\p{L}\p{N}'’]/gu, '')] ?? ''}`}
          variants={child}
          transition={t.spring(spring)}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.span>
  )
}
