import { AnimatePresence, motion } from 'motion/react'
import { Avatar } from '../components/Avatar'
import { Arrow, NodeBox, Svg } from '../components/Diagram'
import { ChapterCard } from '../components/Story'
import { Typewriter } from '../components/Typewriter'
import { Words } from '../components/Words'
import { talk } from '../config'
import { useSlide } from '../deck/SlideContext'
import type { SlideDef } from '../deck/types'

const CH = 2

const SCREEN = { x: 520, y: 210, w: 880, h: 440 }
// Audience: heads seen from behind. John is the blue one.
const SEATS = [230, 420, 610, 800, 990, 1180, 1370, 1560, 1750]
const JOHN_SEAT = 3

/** "Last React conference…": a stage, a speaker, and John in the audience. Step 1: the speaker's name. */
function ConferenceStage() {
  const { step, initial, t } = useSlide()
  const named = step >= 1
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 140, top: 92 }}>
        <Words text="Last React conference…" className="label" stagger={0.08} style={{ fontSize: 34, color: 'var(--ink-2)' }} />
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

const ITEMS = ['Traces', '·', 'Metrics', '·', 'Logs']
// Hex rather than CSS variables: these colors are interpolated by motion.
const INK = '#f6f7f9'
const TRACE = '#ffb224'
const MUTED = '#6c7484'

function ThreeSignals() {
  const { step, initial, t } = useSlide()
  const focus = step >= 1
  return (
    <div className="slide">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 48 }}>
        {ITEMS.map((w, i) => {
          const isTraces = i === 0
          const isDot = w === '·'
          const rest = { opacity: 1, scale: 1, x: 0, color: isDot ? MUTED : INK }
          const focused = isTraces
            ? { opacity: 1, scale: 1.5, x: 0, color: TRACE }
            : { opacity: 0.16, scale: 0.85, x: 150, color: isDot ? MUTED : INK }
          return (
            <motion.span
              key={i}
              className="title"
              initial={initial === false ? false : { opacity: 0, y: 60 }}
              animate={{ ...(focus ? focused : rest), y: 0 }}
              transition={focus ? t.spring(isTraces ? 'bouncy' : 'soft') : t.spring('soft', i * 0.14)}
              style={{ fontSize: 120, display: 'inline-block' }}
            >
              {w}
            </motion.span>
          )
        })}
      </div>
      <Words text="What happened to this one request, everywhere it went." className="body" at={1} delay={0.5} stagger={0.05} style={{ marginTop: 110 }} />
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
 * After the talk: John is sure OpenTelemetry will find his bug.
 * Steps 1–2: what he learns about OpenTelemetry JS. Step 3: not for his frontend, not yet. John is sad.
 */
function OtelHope() {
  const { step, initial, t } = useSlide()
  const sad = step >= 3
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
        <Avatar who="john" size={420} mood={sad ? 'sad' : 'happy'} />
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
            {sad ? 'Not for my React app. Not yet…' : 'OpenTelemetry will show me where it’s slow!'}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div style={{ position: 'absolute', left: 540, top: 380, width: 1240, display: 'flex', flexDirection: 'column', gap: 30 }}>
        <StatusRow at={1} name="Browser instrumentation" pkg="@opentelemetry/sdk-trace-web" status="EXPERIMENTAL" color="var(--warn)" />
        <StatusRow at={2} name="Server-side tracing" pkg="@opentelemetry/sdk-trace-node" status="STABLE" color="var(--ok)" />
      </div>
    </div>
  )
}

const slides: SlideDef[] = [
  { id: 'card-the-talk', title: 'Chapter 3 · The talk', chapter: CH, steps: 1, Component: () => <ChapterCard n={CH} /> },
  { id: 'conference', title: 'Last React conference…', chapter: CH, steps: 2, Component: ConferenceStage },
  { id: 'observability', title: 'Observability, defined', chapter: CH, steps: 2, Component: ObservabilityDef },
  { id: 'three-signals', title: 'Traces · Metrics · Logs', chapter: CH, steps: 2, Component: ThreeSignals },
  { id: 'opentelemetry', title: 'OpenTelemetry, defined', chapter: CH, steps: 4, Component: OpenTelemetry },
  { id: 'otel-hope', title: 'John’s hope… frontend not ready', chapter: CH, steps: 4, Component: OtelHope },
]

export default slides
