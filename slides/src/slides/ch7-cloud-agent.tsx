import { motion } from 'motion/react'
import { Arrow, NodeBox, Svg } from '../components/Diagram'
import { BossSays, ChapterCard } from '../components/Story'
import { Words } from '../components/Words'
import { useSlide } from '../deck/SlideContext'
import type { SlideDef } from '../deck/types'

const CH = 6

const AGENT = { cx: 960, cy: 520, w: 460, h: 210 }
const SOURCES = [
  { label: 'Traces', y: 300, color: 'var(--trace)' },
  { label: 'Logs', y: 520, color: 'var(--ink-2)' },
  { label: 'Metrics', y: 740, color: 'var(--ink-2)' },
]

/** Telemetry flowing in: cheap animated dashes (no filters), still in previews. */
function Stream({ d, color, delay }: { d: string; color: string; delay: number }) {
  const { isStatic, reduced, initial, t } = useSlide()
  const flowing = !isStatic && !reduced
  return (
    <g>
      <path d={d} fill="none" stroke="var(--surface-2)" strokeWidth={4} />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray="6 26"
        initial={initial === false ? false : { opacity: 0 }}
        animate={flowing ? { opacity: 1, strokeDashoffset: [0, -320] } : { opacity: 1 }}
        transition={
          flowing
            ? { opacity: t.tween(0.3, delay), strokeDashoffset: { duration: 2.4, repeat: Infinity, ease: 'linear', delay } }
            : { duration: 0 }
        }
      />
    </g>
  )
}

/** Azure SRE Agent reads traces, logs and metrics. Step 1: it points at the slow query. */
function SreAgent() {
  const { step, initial, t } = useSlide()
  const found = step >= 1
  const left = AGENT.cx - AGENT.w / 2
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div className="label" style={{ position: 'absolute', left: 140, top: 110 }}>
        In the cloud
      </div>
      <Svg>
        {SOURCES.map((s, i) => (
          <Stream key={s.label} d={`M480,${s.y} C600,${s.y} 600,${AGENT.cy - 60 + i * 60} ${left},${AGENT.cy - 60 + i * 60}`} color={s.color} delay={0.5 + i * 0.15} />
        ))}
        {SOURCES.map((s, i) => (
          <NodeBox key={s.label} cx={300} cy={s.y} w={360} h={140} label={s.label} accent={i === 0} delay={i * 0.12} />
        ))}
        <NodeBox cx={AGENT.cx} cy={AGENT.cy} w={AGENT.w} h={AGENT.h} label="Azure SRE Agent" sub="reads your telemetry" delay={0.35} stroke={found ? 'var(--ink)' : undefined} />
        <Arrow from={[AGENT.cx + AGENT.w / 2 + 20, AGENT.cy]} to={[1290, AGENT.cy]} at={1} color="var(--bad)" />
      </Svg>
      <motion.div
        initial={initial}
        animate={found ? 'shown' : 'hidden'}
        variants={{ hidden: { opacity: 0, x: -40, scale: 0.9 }, shown: { opacity: 1, x: 0, scale: 1 } }}
        transition={t.spring('bouncy', 0.35)}
        style={{
          position: 'absolute',
          left: 1300,
          top: AGENT.cy - 220,
          width: 540,
          padding: '36px 40px',
          background: 'var(--surface)',
          border: '3px solid var(--bad)',
          borderRadius: 28,
        }}
      >
        <div className="label" style={{ fontSize: 24, color: 'var(--bad)' }}>
          Finding
        </div>
        <div style={{ fontSize: 42, fontWeight: 750, marginTop: 12, lineHeight: 1.15 }}>GET /events: 101 queries per request</div>
        <div className="mono" style={{ fontSize: 22, color: 'var(--ink-2)', marginTop: 20, lineHeight: 1.5, whiteSpace: 'nowrap' }}>
          SELECT count(*) FROM reservations
          <br />
          WHERE event_id = $1 <span style={{ color: 'var(--bad)' }}>× 100</span>
        </div>
        <div className="mono" style={{ fontSize: 24, color: 'var(--muted)', marginTop: 16 }}>
          N+1 in getEvents() · lib/events.ts
        </div>
      </motion.div>
    </div>
  )
}

function OnlyAsGood() {
  return (
    <div className="slide">
      <Words text="The agent is only as good" className="title" stagger={0.16} spring="slow" style={{ color: 'var(--ink-2)' }} />
      <Words text="as your telemetry." className="title" delay={0.9} stagger={0.2} spring="slow" style={{ marginTop: 16 }} />
    </div>
  )
}

const slides: SlideDef[] = [
  { id: 'card-cloud-agent', title: 'Chapter 7 · Cloud agent', chapter: CH, steps: 1, Component: () => <ChapterCard n={CH} /> },
  { id: 'boss-ai', title: 'Boss: can AI help?', chapter: CH, steps: 1, Component: () => <BossSays text="Can AI help us here too?" john="happy" /> },
  { id: 'sre-agent', title: 'Azure SRE Agent finds it', chapter: CH, steps: 2, Component: SreAgent },
  { id: 'only-as-good', title: 'Only as good as your telemetry', chapter: CH, steps: 1, Component: OnlyAsGood },
]

export default slides
