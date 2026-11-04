import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { CodeBlock } from '../components/CodeBlock'
import { DemoCue } from '../components/DemoCue'
import { Arrow, NodeBox, Svg } from '../components/Diagram'
import { NP, NPlusOneFrame, px, qStart, qTop, QueryCounter, Q_DUR, reqEnd } from '../components/NPlusOne'
import { ChapterCard } from '../components/Story'
import { useCountTo } from '../components/useCountTo'
import { Waterfall, type Span } from '../components/Waterfall'
import { Words } from '../components/Words'
import { useSlide } from '../deck/SlideContext'
import type { SlideDef } from '../deck/types'
import { ARCH, ArchBoxes, EVENTS_CODE, QuestionMark } from './shared'

const CH = 4

/* ---------- Architecture v2: one trace ---------- */

const BOTTOM = ARCH.y + 85
const LANE = 640
// The trace runs under the boxes and dips into each one it passes through.
const POINTS: [number, number][] = [
  [360, BOTTOM],
  [360, LANE],
  [960, LANE],
  [960, BOTTOM],
  [960, LANE],
  [1560, LANE],
  [1560, BOTTOM],
]
const PATH = 'M' + POINTS.map(([x, y]) => `${x},${y}`).join(' L')
const SEGMENTS = POINTS.slice(1).map(([x, y], i) => Math.hypot(x - POINTS[i][0], y - POINTS[i][1]))
const TOTAL = SEGMENTS.reduce((a, b) => a + b, 0)
const TIMES = [0, ...SEGMENTS.map((_, i) => SEGMENTS.slice(0, i + 1).reduce((a, b) => a + b, 0) / TOTAL)]
const TRAVEL = 2.6

function ArchV2() {
  const { step, initial, t } = useSlide()
  const state = step >= 1 ? 'shown' : 'hidden'
  const path = (width: number, opacity: number) => (
    <motion.path
      d={PATH}
      fill="none"
      stroke="var(--trace)"
      strokeWidth={width}
      strokeLinejoin="round"
      strokeLinecap="round"
      initial={initial}
      animate={state}
      variants={{ hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity } }}
      transition={{ pathLength: t.tween(TRAVEL, 0.2, 'linear'), opacity: t.tween(0.15, 0.2) }}
    />
  )
  // The dot travels; a soft halo (a second circle, no CSS filter) moves with it.
  const dot = (r: number, opacity: number) => (
    <motion.circle
      r={r}
      fill="var(--trace)"
      initial={initial}
      animate={state}
      variants={{
        hidden: { cx: POINTS[0][0], cy: POINTS[0][1], opacity: 0 },
        shown: {
          cx: POINTS.map((p) => p[0]),
          cy: POINTS.map((p) => p[1]),
          opacity,
          transition: { ...t.tween(TRAVEL, 0.2, 'linear'), times: TIMES, opacity: t.tween(0.15, 0.2) },
        },
      }}
    />
  )
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div className="label" style={{ position: 'absolute', left: 140, top: 110 }}>
        Project X · v2
      </div>
      <Svg>
        {path(22, 0.18)}
        {path(6, 1)}
        <ArchBoxes
          labels={[
            ['Browser', 'React'],
            ['Next.js server', 'API route'],
            ['Database', 'Postgres'],
          ]}
        />
        {dot(36, 0.25)}
        {dot(18, 1)}
        <motion.text
          x={960}
          y={LANE + 100}
          textAnchor="middle"
          fontSize={44}
          fontFamily="var(--font-mono)"
          fill="var(--trace)"
          initial={initial}
          animate={state}
          variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
          transition={t.tween(0.4, TRAVEL + 0.3)}
        >
          one trace
        </motion.text>
      </Svg>
    </div>
  )
}

/* ---------- traceparent: the ticket ---------- */

const TRACE_ID = '4bf92f3577b34da6a3ce929d0e0e4736'
const LINES: [string, string][] = [
  ['POST', '/api/reserve HTTP/1.1'],
  ['host:', 'project-x.example.com'],
  ['content-type:', 'application/json'],
  ['traceparent:', `00-${TRACE_ID}-00f067aa0ba902b7-01`],
]
const TP = 3
// Card geometry (stage px), so the ticket can start exactly on the traceparent line.
const CARD = { left: 290, top: 450, width: 1340, padY: 40, lineH: 64 }
const TP_Y = CARD.top + CARD.padY + TP * CARD.lineH + CARD.lineH / 2
const TICKET = { w: 560, h: 104 }
const BOX_Y = 230
const LAND_Y = BOX_Y + 85 + 80

function Traceparent() {
  const { step, initial, t } = useSlide()
  const highlight = step >= 1
  const ticket = step >= 2
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Svg>
        <NodeBox cx={360} cy={BOX_Y} w={420} label="Browser" />
        <NodeBox cx={1560} cy={BOX_Y} w={420} label="Server" sub="Next.js" delay={0.15} accent={ticket} />
        <Arrow from={[590, BOX_Y]} to={[1330, BOX_Y]} delay={0.3} />
      </Svg>
      <motion.div
        className="mono"
        initial={initial === false ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t.spring('soft', 0.25)}
        style={{
          position: 'absolute',
          left: CARD.left,
          top: CARD.top,
          width: CARD.width,
          padding: `${CARD.padY}px 0`,
          background: 'var(--surface)',
          border: '2px solid var(--surface-2)',
          borderRadius: 24,
          fontSize: 31,
          lineHeight: `${CARD.lineH}px`,
        }}
      >
        {LINES.map(([k, v], i) => {
          const isTp = i === TP
          return (
            <motion.div
              key={i}
              animate={{
                opacity: highlight && !isTp ? 0.25 : isTp && ticket ? 0.35 : 1,
                backgroundColor: highlight && isTp ? 'rgba(255,178,36,0.14)' : 'rgba(255,178,36,0)',
              }}
              transition={t.spring('snappy')}
              style={{ padding: '0 40px', whiteSpace: 'nowrap', position: 'relative' }}
            >
              <motion.span
                style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: 'var(--trace)', originY: 0 }}
                animate={{ scaleY: highlight && isTp ? 1 : 0 }}
                transition={t.spring('snappy')}
              />
              <span style={{ color: isTp && highlight ? 'var(--trace)' : 'var(--muted)' }}>{k}</span>{' '}
              <span style={{ color: 'var(--ink)' }}>{v}</span>
            </motion.div>
          )
        })}
      </motion.div>
      {/* The ticket: lifts off the traceparent line, rides to the Browser, then across to the Server. */}
      <motion.div
        initial={initial}
        animate={ticket ? 'shown' : 'hidden'}
        variants={{
          hidden: { opacity: 0, x: 0, y: 0, scale: 0.9, transition: t.tween(0.3) },
          shown: {
            opacity: 1,
            scale: 1,
            x: [0, 360 - 960, 1560 - 960],
            y: [0, LAND_Y - TP_Y, LAND_Y - TP_Y],
            transition: {
              x: { ...t.tween(2.4, 0.2), times: [0, 0.35, 1] },
              y: { ...t.tween(2.4, 0.2), times: [0, 0.35, 1] },
              opacity: t.tween(0.2, 0.2),
              scale: t.spring('bouncy', 0.2),
            },
          },
        }}
        style={{
          position: 'absolute',
          left: 960 - TICKET.w / 2,
          top: TP_Y - TICKET.h / 2,
          width: TICKET.w,
          height: TICKET.h,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '0 32px',
          background: 'var(--trace)',
          color: '#050608',
          borderRadius: 18,
          // Ticket notches.
          maskImage: 'radial-gradient(circle 16px at 0 50%, transparent 15px, #000 16px), radial-gradient(circle 16px at 100% 50%, transparent 15px, #000 16px)',
          maskComposite: 'intersect',
        }}
      >
        <span className="mono" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.7 }}>
          trace id
        </span>
        <span className="mono" style={{ fontSize: 36, fontWeight: 700 }}>
          {TRACE_ID.slice(0, 6)}…{TRACE_ID.slice(-4)}
        </span>
      </motion.div>
      <motion.div
        className="body"
        initial={initial}
        animate={ticket ? 'shown' : 'hidden'}
        variants={{ hidden: { opacity: 0, y: 10 }, shown: { opacity: 1, y: 0 } }}
        transition={t.tween(0.4, 2.7, 'easeOut')}
        style={{ position: 'absolute', left: 0, right: 0, top: 870, textAlign: 'center' }}
      >
        Same trace ID on both sides → <span className="accent">one trace</span>
      </motion.div>
    </div>
  )
}

/* ---------- instrumentation.ts ---------- */

const INSTR = `import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const sdk = new NodeSDK({
    serviceName: 'project-x',
    traceExporter: new OTLPTraceExporter(),
    instrumentations: [getNodeAutoInstrumentations()],
  })

  sdk.start()
}
`
const INSTR_STEPS = [
  { lines: [] },
  { lines: [5, 16] }, // Next.js calls register() once at startup
  { lines: [6] }, // Node runtime only
  { lines: [9] }, // the name you'll search for
  { lines: [10] }, // OTLP: vendor-neutral wire format
  { lines: [11] }, // http, fetch, pg... spans for free
  { lines: [14] },
]

/* ---------- Trace waterfall ---------- */

const SPANS: Span[] = [
  { name: 'click: Reserve seat', service: 'browser', start: 0, dur: 186, depth: 0 },
  { name: 'POST /api/reserve', service: 'next.js', start: 14, dur: 158, depth: 1 },
  { name: 'SELECT events', service: 'postgres', start: 26, dur: 18, depth: 2 },
  { name: 'INSERT reservations', service: 'postgres', start: 52, dur: 34, depth: 2 },
  { name: 'UPDATE events', service: 'postgres', start: 94, dur: 22, depth: 2 },
]

function TraceWaterfall() {
  return (
    <div className="slide left">
      <div className="label" style={{ marginBottom: 40 }}>
        John's first trace · <span style={{ color: 'var(--trace)' }}>4bf92f…4736</span> · 5 spans
      </div>
      <Waterfall spans={SPANS} maxMs={200} ticks={[0, 50, 100, 150, 200]} delay={0.4} />
    </div>
  )
}

/* ---------- N+1: the big reveal ---------- */

/**
 * Step 0: "Remember the bug?". Step 1: locally, 10 events = 11 queries, looks fine.
 * Step 2: production, 100 events: the queries cascade, accelerating, to 101; the frame jolts.
 * Step 3: every query turns red and the pattern gets its name.
 */
function NPlusOne() {
  const { step, initial, t, isStatic, reduced } = useSlide()
  const shown = step >= 1
  const prod = step >= 2
  const named = step >= 3
  const CASCADE = 4.2
  const n = Math.floor(
    useCountTo(prod ? 101 : shown ? 11 : 0, {
      duration: prod ? CASCADE : 1.1,
      delay: prod ? 0.2 : 0.6,
      ease: prod ? [0.55, 0, 0.9, 0.4] : 'linear',
      backDuration: 0.5,
    }),
  )
  const jolt = prod && !named && !isStatic && !reduced && step === 2

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <motion.div
        initial={false}
        animate={shown ? 'gone' : 'shown'}
        variants={{ shown: { opacity: 1, scale: 1 }, gone: { opacity: 0, scale: 0.92 } }}
        transition={t.spring('soft')}
        className="slide"
        style={{ zIndex: 2, pointerEvents: 'none' }}
      >
        <Words text="Remember the bug?" className="huge" spring="bouncy" stagger={0.14} style={{ fontSize: 170, whiteSpace: 'nowrap', textAlign: 'center' }} />
        <Words text="“Users say the app is slow.”" className="body" delay={0.7} stagger={0.05} style={{ marginTop: 40, color: 'var(--boss)', textAlign: 'center' }} />
      </motion.div>
      <motion.div
        initial={initial}
        animate={shown ? 'shown' : 'hidden'}
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
        transition={t.tween(0.4, 0.1)}
        style={{ position: 'absolute', inset: 0 }}
      >
        <motion.div
          style={{ position: 'absolute', inset: 0 }}
          animate={jolt ? { x: [0, 0, -14, 12, -8, 5, 0] } : { x: 0 }}
          transition={jolt ? { duration: CASCADE + 0.75, times: [0, 0.86, 0.89, 0.92, 0.95, 0.98, 1] } : { duration: 0 }}
        >
          <NPlusOneFrame endMs={reqEnd(n)}>
            {Array.from({ length: n }, (_, i) => (
              <motion.div
                key={i}
                initial={initial === false ? false : { opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1, backgroundColor: named ? '#ff5468' : i === 0 ? '#f6f7f9' : '#b9c0cc' }}
                transition={{ default: t.tween(0.08, 0, 'easeOut'), backgroundColor: t.tween(0.25, named ? i * 0.006 : 0) }}
                style={{
                  position: 'absolute',
                  left: NP.left + px(qStart(i)),
                  top: qTop(i),
                  width: px(Q_DUR),
                  height: NP.qH,
                  borderRadius: 2,
                  originX: 0,
                }}
              />
            ))}
            <QueryCounter
              queries={n}
              ms={reqEnd(n)}
              note={prod ? '100 events · production' : '10 events · local'}
              color={named || n > 60 ? 'var(--bad)' : 'var(--ink)'}
            />
            <div style={{ position: 'absolute', left: NP.left, top: 730 }}>
              <Words text="N+1" className="huge" at={3} delay={0.4} spring="bouncy" from="scale" style={{ color: 'var(--bad)' }} />
              <Words text="1 query for the list + 1 per event" className="body" at={3} delay={0.7} stagger={0.04} />
            </div>
          </NPlusOneFrame>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ---------- The loop ---------- */

const LOOP_STEPS = [
  { lines: [] },
  { lines: [4, 5, 6, 7, 8, 9] }, // the loop
  { lines: [4, 5, 6, 7, 8, 9], pulse: [5, 6, 7, 8] }, // one round trip per event
]

function LoopCode() {
  return (
    <div className="slide" style={{ paddingTop: 70, paddingBottom: 110 }}>
      <div style={{ width: 1500 }}>
        <CodeBlock
          code={EVENTS_CODE}
          filename="lib/events.ts"
          steps={LOOP_STEPS}
          fontSize={34}
          badge={<span className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink-2)', border: '2px solid var(--ink-2)', borderRadius: 999, padding: '4px 16px' }}>✦ written by AI agent</span>}
        />
      </div>
      <Words
        text="Written by the agent. Approved by the agent. Approved by John."
        className="body"
        at={2}
        delay={0.5}
        stagger={0.09}
        highlight={{ John: 'ink' }}
        style={{ marginTop: 48, fontSize: 50, fontWeight: 650 }}
      />
    </div>
  )
}

/* ---------- Before / after ---------- */

function Panel({ at, title, children, border }: { at: number; title: string; children: ReactNode; border: string }) {
  const { step, initial, t } = useSlide()
  return (
    <motion.div
      initial={initial}
      animate={step >= at ? 'shown' : 'hidden'}
      variants={{ hidden: { opacity: 0, y: 50 }, shown: { opacity: 1, y: 0 } }}
      transition={t.spring('bouncy')}
      style={{ flex: 1, height: 720, padding: '48px 56px', background: 'var(--surface)', border: `3px solid ${border}`, borderRadius: 36, display: 'flex', flexDirection: 'column' }}
    >
      <div className="label" style={{ fontSize: 30, color: 'var(--ink-2)' }}>
        {title}
      </div>
      {children}
    </motion.div>
  )
}

function BeforeAfter() {
  const rows = 26
  return (
    <div className="slide" style={{ flexDirection: 'row', gap: 56, alignItems: 'center', paddingBottom: 140 }}>
      <Panel at={0} title="React + Vite" border="var(--surface-2)">
        <div style={{ flex: 1, position: 'relative' }}>
          <svg viewBox="0 0 700 320" width="100%" height={320} style={{ marginTop: 40 }}>
            {[110, 350, 590].map((cx) => (
              <g key={cx} opacity={0.4}>
                <rect x={cx - 95} y={150} width={190} height={110} rx={20} fill="var(--surface-2)" stroke="var(--line)" strokeWidth={3} />
              </g>
            ))}
            {[110, 350, 590].map((cx) => (
              <QuestionMark key={cx} cx={cx} cy={120} at={0} delay={0.4} />
            ))}
          </svg>
        </div>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--muted)' }}>no idea</div>
      </Panel>
      <Panel at={1} title="Next.js + OpenTelemetry" border="var(--line)">
        <div style={{ flex: 1, position: 'relative', marginTop: 40 }}>
          <div style={{ height: 26, width: '92%', borderRadius: 8, background: 'var(--trace)' }} />
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} style={{ position: 'absolute', top: 40 + i * 6, left: `${2 + i * 3.4}%`, width: '3%', height: 4, borderRadius: 2, background: 'var(--bad)' }} />
          ))}
          <div
            className="mono"
            style={{ position: 'absolute', left: 0, right: 0, top: 230, padding: '18px 24px', borderRadius: 14, background: 'rgba(255,84,104,0.12)', borderLeft: '8px solid var(--bad)', fontSize: 28, whiteSpace: 'nowrap', overflow: 'hidden' }}
          >
            <span style={{ color: 'var(--muted)' }}>lib/events.ts:5</span> <span style={{ color: 'var(--ink)' }}>await db.query(…)</span>
          </div>
        </div>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: '-0.03em' }}>the exact line</div>
      </Panel>
    </div>
  )
}

const slides: SlideDef[] = [
  { id: 'card-telemetry', title: 'Chapter 5 · Telemetry', chapter: CH, steps: 1, Component: () => <ChapterCard n={CH} /> },
  { id: 'arch-v2', title: 'Architecture v2: one trace', chapter: CH, steps: 2, Component: ArchV2 },
  { id: 'traceparent', title: 'The traceparent ticket', chapter: CH, steps: 3, Component: Traceparent },
  {
    id: 'instrumentation',
    title: 'instrumentation.ts',
    chapter: CH,
    steps: INSTR_STEPS.length,
    Component: () => (
      <div className="slide" style={{ paddingBottom: 140 }}>
        <CodeBlock code={INSTR} filename="instrumentation.ts" steps={INSTR_STEPS} fontSize={29} />
      </div>
    ),
  },
  { id: 'demo-first-trace', title: "Demo: John's first trace", chapter: CH, steps: 1, Component: () => <DemoCue title="John's first trace" /> },
  { id: 'waterfall', title: 'Trace waterfall', chapter: CH, steps: 1, Component: TraceWaterfall },
  { id: 'n-plus-one', title: 'Remember the bug? N+1', chapter: CH, steps: 4, Component: NPlusOne },
  { id: 'n-plus-one-code', title: 'The loop (AI-written)', chapter: CH, steps: LOOP_STEPS.length, Component: LoopCode },
  { id: 'before-after', title: 'Before / after', chapter: CH, steps: 2, Component: BeforeAfter },
]

export default slides
