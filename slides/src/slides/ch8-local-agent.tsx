import { motion } from 'motion/react'
import { DemoCue } from '../components/DemoCue'
import { Arrow, DrawPath, NodeBox, Svg } from '../components/Diagram'
import { NP, NPlusOneFrame, px, qStart, qTop, QueryCounter, Q_DUR, reqEnd } from '../components/NPlusOne'
import { ChapterCard } from '../components/Story'
import { useCountTo } from '../components/useCountTo'
import { Words } from '../components/Words'
import { useSlide } from '../deck/SlideContext'
import type { SlideDef } from '../deck/types'

const CH = 7

const Y = 380
const MCP_BOTTOM = Y + 85
const TOOL_Y = 650

function Tool({ cx, name, delay }: { cx: number; name: string; delay: number }) {
  const { step, initial, t } = useSlide()
  return (
    <motion.g
      initial={initial}
      animate={step >= 1 ? 'shown' : 'hidden'}
      variants={{
        hidden: { opacity: 0, scale: 0.3, x: 960 - cx, y: Y - TOOL_Y },
        shown: { opacity: 1, scale: 1, x: 0, y: 0 },
      }}
      transition={t.spring('bouncy', delay)}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
    >
      <rect x={cx - 180} y={TOOL_Y - 42} width={360} height={84} rx={42} fill="var(--surface-2)" stroke="var(--line)" strokeWidth={3} />
      <text x={cx} y={TOOL_Y + 12} textAnchor="middle" fontSize={34} fontFamily="var(--font-mono)" fill="var(--ink)">
        {name}
      </text>
    </motion.g>
  )
}

function AgentMcp() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div className="label" style={{ position: 'absolute', left: 140, top: 110 }}>
        On John's laptop
      </div>
      <Svg>
        <DrawPath d={`M900,${MCP_BOTTOM} C900,560 770,540 770,${TOOL_Y - 42}`} at={1} delay={0.2} />
        <DrawPath d={`M1020,${MCP_BOTTOM} C1020,560 1150,540 1150,${TOOL_Y - 42}`} at={1} delay={0.3} />
        {/* Tools are drawn before the MCP box so they emerge from behind it. */}
        <Tool cx={770} name="search_traces" delay={0.1} />
        <Tool cx={1150} name="find_errors" delay={0.22} />
        <NodeBox cx={330} cy={Y} w={420} label="Claude" sub="local agent" />
        <Arrow from={[560, Y]} to={[730, Y]} delay={0.3} />
        <NodeBox cx={960} cy={Y} w={420} label="MCP server" sub="tools" delay={0.2} />
        <Arrow from={[1190, Y]} to={[1360, Y]} delay={0.55} color="var(--trace)" />
        <NodeBox cx={1590} cy={Y} w={420} label="Traces" sub="Jaeger · local" delay={0.4} accent />
      </Svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 830, textAlign: 'center' }}>
        <Words text="The agent reads the same traces John does." className="body" at={1} delay={0.8} stagger={0.05} />
      </div>
    </div>
  )
}

const BEFORE = { queries: 101, ms: reqEnd(101) }
const AFTER = { queries: 1, ms: 52 }
const FIXED_Q = { start: 12, dur: 28, h: 30 }

/** Same frame as the N+1 slide; on the click, the 101 query spans collapse into one. */
function Fixed() {
  const { step, initial, t } = useSlide()
  const fixed = step >= 1
  const queries = Math.round(useCountTo(fixed ? AFTER.queries : BEFORE.queries, { from: BEFORE.queries, backDuration: 1.1 }))
  const ms = useCountTo(fixed ? AFTER.ms : BEFORE.ms, { from: BEFORE.ms, backDuration: 1.1 })

  return (
    <NPlusOneFrame endMs={ms}>
      {Array.from({ length: 101 }, (_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={fixed ? { x: px(FIXED_Q.start) - px(qStart(i)), y: qTop(0) - qTop(i), opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
          transition={{ default: t.tween(0.7, i * 0.003, 'easeIn'), opacity: t.tween(0.3, 0.4 + i * 0.003) }}
          style={{
            position: 'absolute',
            left: NP.left + px(qStart(i)),
            top: qTop(i),
            width: px(Q_DUR),
            height: NP.qH,
            borderRadius: 2,
            background: 'var(--bad)',
          }}
        />
      ))}
      <motion.div
        initial={initial}
        animate={fixed ? 'shown' : 'hidden'}
        variants={{ hidden: { opacity: 0, scaleY: 0.2 }, shown: { opacity: 1, scaleY: 1 } }}
        transition={t.spring('bouncy', 0.8)}
        style={{ position: 'absolute', left: NP.left + px(FIXED_Q.start), top: qTop(0), display: 'flex', alignItems: 'center', gap: 24 }}
      >
        <span style={{ width: px(FIXED_Q.dur), height: FIXED_Q.h, borderRadius: 6, background: 'var(--ok)' }} />
        <span className="mono" style={{ fontSize: 28, color: 'var(--ok)', whiteSpace: 'nowrap' }}>
          SELECT events LEFT JOIN reservations … GROUP BY
        </span>
      </motion.div>
      <QueryCounter queries={queries} ms={ms} note={fixed ? '100 events · one query' : '100 events · production'} color={fixed ? 'var(--ok)' : 'var(--bad)'} />
    </NPlusOneFrame>
  )
}

const slides: SlideDef[] = [
  { id: 'card-local-agent', title: 'Chapter 8 · Local agent', chapter: CH, steps: 1, Component: () => <ChapterCard n={CH} /> },
  { id: 'agent-mcp', title: 'Claude → MCP → Traces', chapter: CH, steps: 2, Component: AgentMcp },
  {
    id: 'demo-agent',
    title: 'Demo: Claude debugs locally',
    chapter: CH,
    steps: 1,
    Component: () => <DemoCue title="Claude debugs locally" prompt="Users say the events page is slow. Find out why." />,
  },
  { id: 'fixed', title: 'Fixed: one query', chapter: CH, steps: 2, Component: Fixed },
]

export default slides
