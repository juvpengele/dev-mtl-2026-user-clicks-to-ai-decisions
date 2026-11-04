import { motion } from 'motion/react'
import { CHAPTERS } from '../story'
import { Avatar } from './Avatar'

// Hex rather than CSS variables: these colors are interpolated by motion.
const NOW = '#f6f7f9'
const PAST = '#8a93a3'
const NEXT = '#353c49'

/**
 * "John's journey": the nine chapters along the bottom of every slide, current one lit.
 * Lives outside the slide transition so it stays put and only the highlight moves.
 * Deliberately neutral (no amber): amber always means "the trace".
 */
export function JourneyBar({ chapter, animate }: { chapter: number; animate: boolean }) {
  const transition = animate ? { type: 'spring' as const, stiffness: 170, damping: 24 } : { duration: 0 }
  return (
    <div className="journey">
      <span style={{ flex: 'none', width: 34, height: 38, marginRight: 4, marginBottom: -4, opacity: 0.9 }}>
        <Avatar who="john" size={38} />
      </span>
      {CHAPTERS.map((name, i) => {
        const color = i === chapter ? NOW : i < chapter ? PAST : NEXT
        return (
          <div key={name} className="journey-seg">
            <motion.span className="journey-label" initial={false} animate={{ color }} transition={transition}>
              {name}
            </motion.span>
            <motion.span
              className="journey-bar"
              initial={false}
              animate={{ backgroundColor: color, opacity: i === chapter ? 1 : 0.8 }}
              transition={transition}
            />
          </div>
        )
      })}
    </div>
  )
}
