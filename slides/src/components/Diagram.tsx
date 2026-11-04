import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useSlide, type SpringName } from '../deck/SlideContext'

/** A full-stage SVG. Coordinates are stage pixels (1920×1080). */
export function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 1920 1080"
      width={1920}
      height={1080}
      style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      fontFamily="var(--font-sans)"
    >
      {children}
    </svg>
  )
}

const pop = {
  hidden: { opacity: 0, scale: 0.5 },
  shown: { opacity: 1, scale: 1 },
}

/** A box that springs in, centered on (cx, cy). */
export function NodeBox({
  cx,
  cy,
  w = 380,
  h = 170,
  label,
  sub,
  at = 0,
  delay = 0,
  accent = false,
  dim = false,
  spring = 'bouncy',
  still = false,
  stroke,
}: {
  cx: number
  cy: number
  w?: number
  h?: number
  label: string
  sub?: string
  at?: number
  delay?: number
  accent?: boolean
  dim?: boolean
  spring?: SpringName
  /** Already on screen (carried over from the previous slide): skip the entrance. */
  still?: boolean
  /** Override the border color. */
  stroke?: string
}) {
  const { step, initial, t } = useSlide()
  return (
    <motion.g
      initial={still ? false : initial}
      animate={step >= at ? 'shown' : 'hidden'}
      variants={pop}
      transition={t.spring(spring, delay)}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
    >
      <motion.rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={28}
        fill="var(--surface)"
        animate={{
          stroke: stroke ?? (accent ? 'var(--trace)' : 'var(--line)'),
          opacity: dim ? 0.35 : 1,
        }}
        transition={t.spring('soft')}
        strokeWidth={accent ? 5 : 3}
      />
      <motion.g animate={{ opacity: dim ? 0.35 : 1 }} transition={t.spring('soft')}>
        <text
          x={cx}
          y={sub ? cy - 4 : cy + 16}
          textAnchor="middle"
          fontSize={46}
          fontWeight={700}
          fill="var(--ink)"
        >
          {label}
        </text>
        {sub && (
          <text x={cx} y={cy + 46} textAnchor="middle" fontSize={30} fontFamily="var(--font-mono)" fill="var(--ink-2)">
            {sub}
          </text>
        )}
      </motion.g>
    </motion.g>
  )
}

/** A path that draws itself on. */
export function DrawPath({
  d,
  at = 0,
  delay = 0,
  stroke = 'var(--line)',
  width = 4,
  dash,
  spring = 'draw',
}: {
  d: string
  at?: number
  delay?: number
  stroke?: string
  width?: number
  dash?: string
  spring?: SpringName
}) {
  const { step, initial, t } = useSlide()
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash}
      initial={initial}
      animate={step >= at ? 'shown' : 'hidden'}
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        shown: { pathLength: 1, opacity: 1 },
      }}
      transition={{
        pathLength: t.spring(spring, delay),
        opacity: t.spring('snappy', delay),
      }}
    />
  )
}

/** Straight arrow from a to b that draws on, with a head that pops at the end. */
export function Arrow({
  from,
  to,
  at = 0,
  delay = 0,
  color = 'var(--line)',
  width = 4,
}: {
  from: [number, number]
  to: [number, number]
  at?: number
  delay?: number
  color?: string
  width?: number
}) {
  const { step, initial, t } = useSlide()
  const [x1, y1] = from
  const [x2, y2] = to
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  return (
    <g>
      <DrawPath d={`M${x1},${y1} L${x2},${y2}`} at={at} delay={delay} stroke={color} width={width} spring="soft" />
      <motion.path
        d="M-22,-13 L0,0 L-22,13"
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={`translate(${x2},${y2}) rotate(${angle})`}
        initial={initial}
        animate={step >= at ? 'shown' : 'hidden'}
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
        transition={t.spring('snappy', delay + 0.35)}
      />
    </g>
  )
}

/** Pulsing "live" dot used on demo cues and flows. */
export function LiveDot({ size = 28 }: { size?: number }) {
  const { isStatic, reduced } = useSlide()
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--trace)' }} />
      {!isStatic && !reduced && (
        <motion.span
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--trace)' }}
          animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
    </span>
  )
}
