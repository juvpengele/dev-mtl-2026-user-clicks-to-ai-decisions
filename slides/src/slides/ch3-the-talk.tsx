import { AnimatePresence, motion } from 'motion/react'
import { Fragment } from 'react'
import { Avatar } from '../components/Avatar'
import { Arrow, NodeBox, Svg } from '../components/Diagram'
import { AtomIcon } from '../components/Icons'
import { ChapterCard, JohnCorner } from '../components/Story'
import { Typewriter } from '../components/Typewriter'
import { Waterfall, type Span } from '../components/Waterfall'
import { Words } from '../components/Words'
import { talk } from '../config'
import { useSlide } from '../deck/SlideContext'
import type { SlideDef } from '../deck/types'
import { ARCH, ArchBoxes } from './shared'

const CH = 2

const SCREEN = { x: 520, y: 210, w: 880, h: 440 }
// Audience: heads seen from behind. John is the blue one.
const SEATS = [230, 420, 610, 800, 990, 1180, 1370, 1560, 1750]
const JOHN_SEAT = 3

/** A grey placeholder post in John's feed (scrolls past before the meetup post). */
function GhostPost() {
  return (
    <div style={{ padding: '36px 44px', background: 'var(--surface)', borderRadius: 28, border: '2px solid var(--surface-2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: 'var(--surface-2)' }} />
        <div style={{ width: 300, height: 22, borderRadius: 11, background: 'var(--surface-2)' }} />
      </div>
      <div style={{ marginTop: 30, width: '90%', height: 20, borderRadius: 10, background: 'var(--surface-2)' }} />
      <div style={{ marginTop: 18, width: '62%', height: 20, borderRadius: 10, background: 'var(--surface-2)' }} />
    </div>
  )
}

/** John scrolls LinkedIn and finds the React Montréal meetup on observability. Step 1: he signs up. */
function MeetupPost() {
  const { step, initial, t } = useSlide()
  const going = step >= 1
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 140, top: 92 }}>
        <Words text="John scrolls LinkedIn…" className="label" stagger={0.08} style={{ fontSize: 34, color: 'var(--ink-2)' }} />
      </div>
      {/* The feed: two grey posts scroll past, then the meetup post lands in view. */}
      <div style={{ position: 'absolute', left: 140, top: 170, width: 1120, bottom: 110, overflow: 'hidden', borderRadius: 28 }}>
        <motion.div
          initial={initial === false ? false : { y: 640 }}
          animate={{ y: 0 }}
          transition={t.tween(1.4, 0.3, [0.22, 1, 0.36, 1])}
          style={{ display: 'flex', flexDirection: 'column', gap: 32, position: 'absolute', left: 0, right: 0, bottom: 0 }}
        >
          <GhostPost />
          <GhostPost />
          <div style={{ padding: '44px 52px', background: 'var(--surface)', borderRadius: 28, border: '2px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
              <div style={{ width: 96, height: 96, borderRadius: 48, background: 'var(--surface-2)', display: 'grid', placeItems: 'center' }}>
                <AtomIcon />
              </div>
              <div>
                <div style={{ fontSize: 40, fontWeight: 750 }}>React Montréal</div>
                <div className="label" style={{ fontSize: 24, marginTop: 6 }}>
                  Meetup · Montréal
                </div>
              </div>
            </div>
            <div style={{ marginTop: 36, fontSize: 36, color: 'var(--ink-2)' }}>Next meetup: observability for React apps.</div>
            <div style={{ marginTop: 14, fontSize: 56, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>OpenTelemetry in Frontend Applications</div>
            <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 28 }}>
              <motion.div
                animate={{ background: going ? '#3ddc84' : '#5b8def', scale: going ? [1, 1.12, 1] : 1 }}
                transition={t.tween(0.4)}
                style={{ padding: '16px 40px', borderRadius: 40, fontSize: 34, fontWeight: 750, color: '#050608' }}
              >
                {going ? 'Going ✓' : 'Attend'}
              </motion.div>
              <span className="label" style={{ fontSize: 26 }}>
                {going ? 'John + 87 others' : '87 attendees'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      <JohnCorner mood={going ? 'happy' : 'worried'} delay={1.6} size={340} />
    </div>
  )
}

/** "At the React Montréal meetup…": a stage, a speaker, and John in the audience. Step 1: the speaker's name. */
function ConferenceStage() {
  const { step, initial, t } = useSlide()
  const named = step >= 1
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 140, top: 92 }}>
        <Words text="At the React Montréal meetup…" className="label" stagger={0.08} style={{ fontSize: 34, color: 'var(--ink-2)' }} />
      </div>
      <motion.div
        initial={initial === false ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t.tween(0.8, 0.2, 'easeOut')}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Svg>
          {/* Stage floor */}
          <path d="M260,770 L1660,770 L1760,850 L160,850 Z" fill="#141820" stroke="var(--surface-2)" strokeWidth={2} />
          {/* Screen: the talk John saw. The speaker's name is revealed on the click. */}
          <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={SCREEN.h} rx={18} fill="var(--surface)" stroke="var(--line)" strokeWidth={3} />
          <text x={SCREEN.x + 60} y={SCREEN.y + 140} fontSize={54} fontWeight={800} fill="var(--ink)" letterSpacing="-1">
            OpenTelemetry in
          </text>
          <text x={SCREEN.x + 60} y={SCREEN.y + 206} fontSize={54} fontWeight={800} fill="var(--ink)" letterSpacing="-1">
            Frontend Applications
          </text>
          <rect x={SCREEN.x + 60} y={SCREEN.y + 240} width={110} height={8} rx={4} fill="var(--trace)" />
          {/* Speaker at the lectern */}
          <Avatar who="speaker" size={200} x={1470} y={548} />
          <path d="M1480,650 L1620,650 L1602,770 L1498,770 Z" fill="var(--surface-2)" stroke="var(--line)" strokeWidth={2} />
          {/* Audience */}
          {SEATS.map((x, i) =>
            i === JOHN_SEAT ? (
              <Avatar key={i} who="john" back size={150} x={x - 68} y={860} />
            ) : (
              <g key={i}>
                <circle cx={x} cy={920} r={32} fill="#1d222b" />
                <path d={`M${x - 60},1010 C${x - 60},975 ${x - 35},960 ${x},960 C${x + 35},960 ${x + 60},975 ${x + 60},1010 Z`} fill="#1d222b" />
              </g>
            ),
          )}
        </Svg>
      </motion.div>
      {/* "John" tag over his head */}
      <motion.div
        className="label"
        initial={initial === false ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t.spring('bouncy', 1)}
        style={{ position: 'absolute', left: SEATS[JOHN_SEAT] - 60, width: 120, top: 836, textAlign: 'center', fontSize: 24, color: 'var(--john)' }}
      >
        John ↓
      </motion.div>
      {/* Lower third: the speaker's name. Leave a beat. */}
      <motion.div
        initial={initial}
        animate={named ? 'shown' : 'hidden'}
        variants={{ hidden: { opacity: 0, x: -40 }, shown: { opacity: 1, x: 0 } }}
        transition={t.spring('bouncy')}
        style={{
          position: 'absolute',
          left: SCREEN.x - 60,
          top: SCREEN.y + SCREEN.h - 70,
          padding: '20px 36px',
          background: 'var(--ink)',
          color: '#050608',
          borderRadius: 14,
          fontSize: 46,
          fontWeight: 800,
          letterSpacing: '-0.01em',
        }}
      >
        <Typewriter text={talk.speaker} at={1} delay={0.25} cps={26} cursor={false} />
      </motion.div>
    </div>
  )
}

function ObservabilityDef() {
  return (
    <div className="slide left">
      <Words
        text="Observability is your ability to understand what your system is doing from the outside, by looking at the data it emits."
        className="title"
        stagger={0.09}
        spring="soft"
        style={{ fontSize: 80, maxWidth: 1640, lineHeight: 1.14, color: 'var(--ink-2)' }}
        highlight={{ Observability: 'ink', outside: 'ink', emits: 'ink' }}
      />
      <Words text="Not by guessing." className="title" at={1} stagger={0.12} spring="slow" style={{ fontSize: 64, marginTop: 72 }} />
      <Words
        text="Not by adding console.logs and redeploying."
        className="title"
        at={1}
        delay={0.7}
        stagger={0.12}
        spring="slow"
        style={{ fontSize: 64, marginTop: 12 }}
        highlight={{ consolelogs: 'mono' }}
      />
    </div>
  )
}

const ITEMS = ['Logs', '·', 'Metrics', '·', 'Traces']
// One sentence per signal; click order follows ITEMS (Logs → Metrics → Traces).
const SIGNALS = [
  { word: 'Logs', sentence: 'What your code said happened, one line at a time.' },
  { word: 'Metrics', sentence: 'Numbers over time: how many, how often, how slow.' },
  { word: 'Traces', sentence: 'What happened to this one request, everywhere it went.' },
]
// Hex rather than CSS variables: these colors are interpolated by motion.
const INK = '#f6f7f9'
const TRACE = '#ffb224'
const MUTED = '#6c7484'

/** Step 0: the three signals. Steps 1–3: Logs, then Metrics, then Traces, each with its sentence. */
function ThreeSignals() {
  const { step, initial, t } = useSlide()
  const active = step >= 1 ? SIGNALS[Math.min(step, SIGNALS.length) - 1] : null
  return (
    <div className="slide">
      <div style={{ display: 'flex', flexWrap: 'nowrap', whiteSpace: 'nowrap', alignItems: 'baseline', gap: 48 }}>
        {ITEMS.map((w, i) => {
          const isDot = w === '·'
          const isActive = active?.word === w
          const isTraces = w === 'Traces'
          const rest = { opacity: 1, scale: 1, color: isDot ? MUTED : INK }
          const state = !active
            ? rest
            : isActive
              ? { opacity: 1, scale: 1.3, color: isTraces ? TRACE : INK }
              : { opacity: 0.16, scale: 0.85, color: isDot ? MUTED : INK }
          return (
            <motion.span
              key={i}
              className="title"
              initial={initial === false ? false : { opacity: 0, y: 60 }}
              animate={{ ...state, y: 0 }}
              transition={active ? t.spring(isActive ? 'bouncy' : 'soft') : t.spring('soft', i * 0.14)}
              style={{ fontSize: 120, display: 'inline-block' }}
            >
              {w}
            </motion.span>
          )
        })}
      </div>
      <div style={{ position: 'relative', height: 70, marginTop: 110, alignSelf: 'stretch', display: 'flex', justifyContent: 'center' }}>
        <AnimatePresence initial={false} mode="popLayout">
          {active && (
            <motion.div
              key={active.word}
              className="body"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={t.spring('snappy')}
              style={{ whiteSpace: 'nowrap' }}
            >
              {active.sentence}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- Anatomy of a trace ---------- */

const ANATOMY_SPANS: Span[] = [
  { name: 'GET /events', service: 'browser', start: 0, dur: 420, depth: 0 },
  { name: 'GET /api/events', service: 'next.js', start: 20, dur: 380, depth: 1 },
  { name: 'SELECT events', service: 'sqlite', start: 40, dur: 60, depth: 2 },
  { name: 'SELECT seats', service: 'sqlite', start: 120, dur: 60, depth: 2 },
]

const ANATOMY_CAPTIONS = [
  'One request, end to end.',
  'Each span is one step: an HTTP call, a database query.',
  'Spans are nested: a parent and its children.',
  'Each one has a duration and attributes that describe it.',
]

const ATTRS: [string, string][] = [
  ['duration', '60 ms'],
  ['db.system', 'sqlite'],
  ['db.table', 'seats'],
  ['parent', 'GET /api/events'],
]

/** "A trace is made of spans." Steps: one step per span → nesting → duration + attributes. */
function TraceAnatomy() {
  const { step, initial, t } = useSlide()
  return (
    <div className="slide left" style={{ justifyContent: 'flex-start', paddingTop: 100 }}>
      <Words text="A trace is made of spans." className="title" spring="bouncy" style={{ fontSize: 84 }} highlight={{ spans: 'ink' }} />
      <div style={{ position: 'relative', marginTop: 48 }}>
        <Waterfall spans={ANATOMY_SPANS} maxMs={450} ticks={[0, 100, 200, 300, 400]} delay={0.5} speed={300} />
        {/* Step 1: tag the kind of step each span is. */}
        {(['HTTP call', 'HTTP call', 'DB query', 'DB query'] as const).map((tag, i) => (
          <motion.span
            key={i}
            className="label"
            initial={initial}
            animate={step === 1 ? 'shown' : 'hidden'}
            variants={{ hidden: { opacity: 0, x: -10 }, shown: { opacity: 1, x: 0 } }}
            transition={t.spring('soft', i * 0.12)}
            style={{
              position: 'absolute',
              left: 396,
              top: 70 + i * 104 + 32,
              fontSize: 22,
              padding: '6px 14px',
              borderRadius: 8,
              background: 'var(--surface-2)',
              color: 'var(--ink)',
              whiteSpace: 'nowrap',
            }}
          >
            {tag}
          </motion.span>
        ))}
        {/* Step 2: brackets show which spans are children of which. */}
        {[
          { from: 0, to: 1, x: 8 },
          { from: 1, to: 3, x: 48 },
        ].map((b, i) => (
          <motion.div
            key={i}
            initial={initial}
            animate={step === 2 ? 'shown' : 'hidden'}
            variants={{ hidden: { opacity: 0, scaleY: 0 }, shown: { opacity: 1, scaleY: 1 } }}
            transition={t.spring('soft', i * 0.25)}
            style={{
              position: 'absolute',
              left: b.x - 22,
              top: 70 + b.from * 104 + 52,
              height: (b.to - b.from) * 104,
              width: 16,
              borderLeft: '4px solid var(--john)',
              borderBottom: '4px solid var(--john)',
              borderBottomLeftRadius: 10,
              originY: 0,
            }}
          />
        ))}
        {/* Step 3: open one span and look inside. */}
        <motion.div
          initial={initial}
          animate={step >= 3 ? 'shown' : 'hidden'}
          variants={{ hidden: { opacity: 0, scale: 0.85, y: 20 }, shown: { opacity: 1, scale: 1, y: 0 } }}
          transition={t.spring('bouncy')}
          style={{
            position: 'absolute',
            left: 1150,
            top: 268,
            width: 490,
            padding: '22px 30px',
            background: 'var(--surface)',
            border: '2px solid var(--line)',
            borderRadius: 22,
            originX: 0,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 750 }}>SELECT seats</div>
          <div className="label" style={{ fontSize: 20, marginTop: 4 }}>
            span
          </div>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 24, rowGap: 6 }}>
            {ATTRS.map(([k, v]) => (
              <Fragment key={k}>
                <span className="mono" style={{ fontSize: 24, color: 'var(--muted)' }}>
                  {k}
                </span>
                <span className="mono" style={{ fontSize: 24, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                  {v}
                </span>
              </Fragment>
            ))}
          </div>
        </motion.div>
      </div>
      <div style={{ position: 'relative', height: 70, marginTop: 80, alignSelf: 'stretch' }}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={step}
            className="body"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={t.spring('snappy')}
            style={{ fontSize: 48, color: 'var(--ink)', whiteSpace: 'nowrap' }}
          >
            {ANATOMY_CAPTIONS[Math.min(step, ANATOMY_CAPTIONS.length - 1)]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

const OY = 730

/** OpenTelemetry, without logos: SDK → OTLP → any backend, built left to right. */
function OpenTelemetry() {
  const { step, initial, t } = useSlide()
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 140, top: 120, right: 140 }}>
        <Words text="OpenTelemetry" className="title" spring="bouncy" />
        <Words
          text="An open standard to create, collect, and export telemetry. Vendor-neutral."
          className="body"
          delay={0.35}
          stagger={0.05}
          highlight={{ Vendorneutral: 'ink' }}
          style={{ marginTop: 28, maxWidth: 1500, fontSize: 52 }}
        />
      </div>
      <Svg>
        <NodeBox cx={380} cy={OY} w={440} label="SDK" sub="in your app" at={1} />
        <Arrow from={[620, OY]} to={[1070, OY]} at={2} />
        <motion.text
          x={845}
          y={OY - 30}
          textAnchor="middle"
          fontSize={40}
          fontWeight={700}
          fontFamily="var(--font-mono)"
          fill="var(--ink)"
          initial={initial}
          animate={step >= 2 ? 'shown' : 'hidden'}
          variants={{ hidden: { opacity: 0, y: 10 }, shown: { opacity: 1, y: 0 } }}
          transition={t.spring('soft', 0.2)}
        >
          OTLP
        </motion.text>
        <motion.text
          x={845}
          y={OY + 60}
          textAnchor="middle"
          fontSize={26}
          fontFamily="var(--font-mono)"
          fill="var(--muted)"
          initial={initial}
          animate={step >= 2 ? 'shown' : 'hidden'}
          variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
          transition={t.spring('soft', 0.35)}
        >
          one wire format
        </motion.text>
        {/* Ghost cards behind "Any backend": there are many. */}
        {[2, 1].map((k) => (
          <motion.rect
            key={k}
            x={1380 - 280 + k * 26}
            y={OY - 85 - k * 26}
            width={560}
            height={170}
            rx={28}
            fill="var(--surface)"
            stroke="var(--line)"
            strokeWidth={3}
            initial={initial}
            animate={step >= 3 ? 'shown' : 'hidden'}
            variants={{ hidden: { opacity: 0, x: -k * 26, y: k * 26 }, shown: { opacity: 1 - k * 0.3, x: 0, y: 0 } }}
            transition={t.spring('bouncy', 0.25 + k * 0.08)}
          />
        ))}
        <NodeBox cx={1380} cy={OY} w={560} label="Any backend" sub="open source · cloud · SaaS" at={3} />
      </Svg>
    </div>
  )
}

function StatusRow({ at, name, pkg, status, color }: { at: number; name: string; pkg: string; status: string; color: string }) {
  const { step, initial, t } = useSlide()
  return (
    <motion.div
      initial={initial}
      animate={step >= at ? 'shown' : 'hidden'}
      variants={{ hidden: { opacity: 0, y: 40 }, shown: { opacity: 1, y: 0 } }}
      transition={t.spring('bouncy', at === 0 ? 0.35 : 0)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 40,
        padding: '44px 56px',
        background: 'var(--surface)',
        border: '2px solid var(--surface-2)',
        borderLeft: `12px solid ${color}`,
        borderRadius: 24,
      }}
    >
      <div>
        <div style={{ fontSize: 54, fontWeight: 750, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{name}</div>
        <div className="mono" style={{ fontSize: 28, color: 'var(--muted)', marginTop: 8 }}>
          {pkg}
        </div>
      </div>
      <span className="mono" style={{ fontSize: 40, fontWeight: 800, letterSpacing: '0.06em', color, border: `4px solid ${color}`, borderRadius: 999, padding: '12px 36px' }}>
        {status}
      </span>
    </motion.div>
  )
}

/**
 * John leaves the meetup excited. That night he opens the OpenTelemetry docs.
 * Step 1: server tracing is stable. Step 2: the browser is still experimental. John worries.
 */
function OtelHope() {
  const { step, initial, t } = useSlide()
  const sad = step >= 2
  const dot = (d: number, delay: number, left: number, top: number) => (
    <motion.span
      initial={initial === false ? false : { opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={t.spring('bouncy', delay)}
      style={{ position: 'absolute', left, top, width: d, height: d, borderRadius: d, background: 'var(--surface-2)' }}
    />
  )
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <motion.div
        initial={initial === false ? false : { opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t.spring('bouncy')}
        style={{ position: 'absolute', left: 120, bottom: 90 }}
      >
        <Avatar who="john" size={420} mood={sad ? 'worried' : 'happy'} />
      </motion.div>
      {dot(26, 0.25, 400, 540)}
      {dot(40, 0.35, 450, 440)}
      <motion.div
        initial={initial === false ? false : { opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={t.spring('bouncy', 0.4)}
        style={{
          position: 'absolute',
          left: 540,
          top: 100,
          width: 1240,
          height: 200,
          padding: '0 64px',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--surface-2)',
          borderRadius: 100,
          overflow: 'hidden',
          originX: 0,
          originY: 1,
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={sad ? 'sad' : 'hope'}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={t.spring('snappy')}
            style={{ fontSize: 54, fontWeight: 750, letterSpacing: '-0.02em', whiteSpace: 'nowrap', color: sad ? 'var(--ink-2)' : 'var(--ink)' }}
          >
            {sad ? 'Wait… experimental?' : 'Finally, something better than console.log!'}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="label"
        initial={initial}
        animate={step >= 1 ? 'shown' : 'hidden'}
        variants={{ hidden: { opacity: 0, y: 10 }, shown: { opacity: 1, y: 0 } }}
        transition={t.spring('soft')}
        style={{ position: 'absolute', left: 540, top: 340, fontSize: 28 }}
      >
        That night · the OpenTelemetry JS docs
      </motion.div>
      <div style={{ position: 'absolute', left: 540, top: 410, width: 1240, display: 'flex', flexDirection: 'column', gap: 30 }}>
        <StatusRow at={1} name="Server-side tracing" pkg="@opentelemetry/sdk-trace-node" status="STABLE" color="var(--ok)" />
        <StatusRow at={2} name="Browser instrumentation" pkg="@opentelemetry/sdk-trace-web" status="EXPERIMENTAL" color="var(--warn)" />
      </div>
    </div>
  )
}

/* ---------- John feels stuck: v1 is almost all browser ---------- */

const V1: [string, string | undefined][] = [
  ['Browser', 'React + Vite'],
  ['API', 'thin Express'],
  ['Database', 'Postgres'],
]
const BOX_BOTTOM = ARCH.y + 85
// The browser half of a trace: from the click, out of the box… and it stops before reaching the API.
const CLICK_X = ARCH.xs[0] + 170
const LANE_Y = BOX_BOTTOM - 30
const STOP_X = ARCH.xs[0] + ARCH.w / 2 + 110
const STUB = `M${CLICK_X},${LANE_Y} L${STOP_X},${LANE_Y}`
const STUCK_CAPTIONS = [
  'Now think about John’s app.',
  'The right tool… and almost nowhere to use it.',
  'His trace starts… and almost immediately ends.',
]

/** A pill above a box: how mature OpenTelemetry is there. */
function Maturity({ cx, text, color, at }: { cx: number; text: string; color: string; at: number }) {
  const { step, initial, t } = useSlide()
  return (
    <motion.g
      initial={initial}
      animate={step >= at ? 'shown' : 'hidden'}
      variants={{ hidden: { opacity: 0, y: 20 }, shown: { opacity: 1, y: 0 } }}
      transition={t.spring('bouncy', 0.15)}
    >
      <rect x={cx - 170} y={ARCH.y - 170} width={340} height={64} rx={32} fill="none" stroke={color} strokeWidth={4} />
      <text x={cx} y={ARCH.y - 126} textAnchor="middle" fontSize={30} fontWeight={800} letterSpacing="0.06em" fontFamily="var(--font-mono)" fill={color}>
        {text}
      </text>
    </motion.g>
  )
}

/**
 * John's v1 is almost all frontend. Step 1: OpenTelemetry is experimental where his code lives,
 * stable where there's almost nothing. Step 2: his trace starts in the browser and ends right there.
 * Step 3: the browser is where a trace starts, not where it lives.
 */
function JohnStuck() {
  const { step, initial, t } = useSlide()
  const traced = step >= 2 ? 'shown' : 'hidden'
  const punchline = step >= 3
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div className="label" style={{ position: 'absolute', left: 140, top: 110 }}>
        Project X · v1
      </div>
      <Svg>
        <ArchBoxes labels={V1} />
        {(['almost all the code', 'barely does anything'] as const).map((text, i) => (
          <motion.text
            key={text}
            x={ARCH.xs[i]}
            y={BOX_BOTTOM + 60}
            textAnchor="middle"
            fontSize={30}
            fontFamily="var(--font-mono)"
            fill="var(--ink-2)"
            initial={initial}
            animate="shown"
            variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
            transition={t.spring('soft', 0.9 + i * 0.2)}
          >
            {text}
          </motion.text>
        ))}
        <Maturity cx={ARCH.xs[0]} text="EXPERIMENTAL" color="var(--warn)" at={1} />
        <Maturity cx={ARCH.xs[1]} text="STABLE" color="var(--ok)" at={1} />
        {/* The click that starts the trace. */}
        <motion.circle
          cx={CLICK_X}
          cy={LANE_Y}
          r={16}
          fill="var(--trace)"
          initial={initial}
          animate={traced}
          variants={{ hidden: { opacity: 0, scale: 0 }, shown: { opacity: 1, scale: [0, 1.6, 1] } }}
          transition={t.tween(0.5, 0.1)}
        />
        <motion.path
          d={STUB}
          fill="none"
          stroke="var(--trace)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={initial}
          animate={traced}
          variants={{ hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 1 } }}
          transition={{ pathLength: t.tween(0.6, 0.5, 'easeOut'), opacity: t.tween(0.15, 0.5) }}
        />
        {/* …and where it ends: a hard stop well before the API. */}
        <motion.path
          d={`M${STOP_X},${LANE_Y - 26} L${STOP_X},${LANE_Y + 26}`}
          stroke="var(--trace)"
          strokeWidth={6}
          strokeLinecap="round"
          initial={initial}
          animate={traced}
          variants={{ hidden: { opacity: 0, scaleY: 0 }, shown: { opacity: 1, scaleY: 1 } }}
          transition={t.spring('bouncy', 1.1)}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      </Svg>
      <div style={{ position: 'absolute', left: 140, top: 760, width: 1300, height: 200 }}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={punchline ? 'punchline' : step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={t.spring('snappy')}
            style={{ fontSize: punchline ? 64 : 52, fontWeight: punchline ? 800 : 600, letterSpacing: '-0.02em', lineHeight: 1.2, color: 'var(--ink)' }}
          >
            {punchline ? (
              <>
                The browser is where a trace starts.
                <br />
                <span style={{ color: 'var(--ink-2)' }}>It’s not where it lives.</span>
              </>
            ) : (
              STUCK_CAPTIONS[step]
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <JohnCorner mood={step >= 1 ? 'sad' : 'worried'} size={260} delay={0.6} />
    </div>
  )
}

const slides: SlideDef[] = [
  { id: 'card-the-talk', title: 'Chapter 3 · The talk', chapter: CH, steps: 1, Component: () => <ChapterCard n={CH} /> },
  { id: 'meetup-post', title: 'LinkedIn: React Montréal meetup', chapter: CH, steps: 2, Component: MeetupPost },
  { id: 'conference', title: 'At the React Montréal meetup…', chapter: CH, steps: 2, Component: ConferenceStage },
  { id: 'observability', title: 'Observability, defined', chapter: CH, steps: 2, Component: ObservabilityDef },
  { id: 'three-signals', title: 'Logs · Metrics · Traces', chapter: CH, steps: 4, Component: ThreeSignals },
  { id: 'trace-anatomy', title: 'A trace is made of spans', chapter: CH, steps: 4, Component: TraceAnatomy },
  { id: 'opentelemetry', title: 'OpenTelemetry, defined', chapter: CH, steps: 4, Component: OpenTelemetry },
  { id: 'otel-hope', title: 'John’s hope… then the docs', chapter: CH, steps: 3, Component: OtelHope },
  { id: 'john-stuck', title: 'John feels stuck: the trace ends in the browser', chapter: CH, steps: 4, Component: JohnStuck },
]

export default slides
