import { motion } from 'motion/react'
import { Arrow, NodeBox } from '../components/Diagram'
import { useSlide } from '../deck/SlideContext'

/** The AI-written code. Typed in on "ai-builds", exposed on "n-plus-one-code". Same file both times. */
export const EVENTS_CODE = `export async function getEvents() {
  const events = await db.query('SELECT * FROM events')

  for (const event of events) {
    event.seatsTaken = await db.query(
      'SELECT count(*) FROM reservations WHERE event_id = $1',
      [event.id],
    )
  }

  return events
}
`

/** Three-box architecture, shared by v1 (React + Vite) and v2 (Next.js) so boxes line up across slides. */
export const ARCH = { y: 420, w: 420, xs: [360, 960, 1560] as const }

export function ArchBoxes({
  labels,
  still = false,
  dimmed = [],
}: {
  labels: [string, string | undefined][]
  still?: boolean
  dimmed?: boolean[]
}) {
  const { y, w, xs } = ARCH
  return (
    <>
      {xs.map((cx, i) => (
        <NodeBox key={i} cx={cx} cy={y} w={w} label={labels[i][0]} sub={labels[i][1]} delay={still ? 0 : i * 0.25} still={still} dim={dimmed[i]} />
      ))}
      {[0, 1].map((i) => (
        <motion.g key={i} initial={false} animate={{ opacity: dimmed[i] && dimmed[i + 1] ? 0.35 : 1 }}>
          <Arrow from={[xs[i] + w / 2 + 20, y]} to={[xs[i + 1] - w / 2 - 20, y]} delay={still ? 0 : 0.45 + i * 0.25} />
        </motion.g>
      ))}
    </>
  )
}

/** A "?" that pops above a box. */
export function QuestionMark({ cx, cy, at, delay = 0 }: { cx: number; cy: number; at: number; delay?: number }) {
  const { step, initial, t } = useSlide()
  return (
    <motion.text
      x={cx}
      y={cy}
      textAnchor="middle"
      fontSize={150}
      fontWeight={800}
      fill="var(--ink-2)"
      initial={initial}
      animate={step >= at ? 'shown' : 'hidden'}
      variants={{ hidden: { opacity: 0, scale: 0.2, y: 30 }, shown: { opacity: 1, scale: 1, y: 0 } }}
      transition={t.spring('bouncy', delay)}
      style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
    >
      ?
    </motion.text>
  )
}
