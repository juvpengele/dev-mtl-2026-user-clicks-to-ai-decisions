import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Avatar } from '../components/Avatar'
import { AtomIcon } from '../components/Icons'
import { CodeBlock } from '../components/CodeBlock'
import { DrawPath } from '../components/Diagram'
import { BossSays, ChapterCard } from '../components/Story'
import { Typewriter } from '../components/Typewriter'
import { Words } from '../components/Words'
import { talk } from '../config'
import { useSlide } from '../deck/SlideContext'
import type { SlideDef } from '../deck/types'
import { WhoDecided } from './WhoDecided'
import { EVENTS_CODE } from './shared'

const CH = 0

function Title() {
  const { initial, t } = useSlide()
  return (
    <div className="slide left">
      <Words text={talk.titleLine1} className="title" spring="bouncy" stagger={0.08} style={{ fontSize: 124 }} />
      <motion.div
        initial={initial === false ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={t.spring('soft', 0.55)}
        style={{ width: 280, height: 10, borderRadius: 5, background: 'var(--trace)', originX: 0, margin: '48px 0 40px' }}
      />
      <Words text={talk.titleLine2} className="body" delay={0.7} stagger={0.05} style={{ fontSize: 60, color: 'var(--ink-2)' }} />
      <motion.div
        initial={initial === false ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t.spring('soft', 1.4)}
        style={{ marginTop: 120, display: 'flex', gap: 28, alignItems: 'baseline' }}
      >
        <span style={{ fontSize: 44, fontWeight: 750 }}>{talk.speaker}</span>
        <span className="label" style={{ color: 'var(--ink-2)' }}>
          {talk.event}
        </span>
      </motion.div>
    </div>
  )
}

function MeetJohn() {
  const { step, initial, t } = useSlide()
  return (
    <div className="slide" style={{ flexDirection: 'row', gap: 120 }}>
      <motion.div
        initial={initial === false ? false : { opacity: 0, y: 120, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={t.spring('bouncy')}
      >
        <Avatar who="john" size={600} mood="happy" />
      </motion.div>
      <div>
        <Words text="Meet John Doe." className="title" delay={0.3} spring="bouncy" />
        <Words text="Developer. Ships fast. Uses AI every day." className="body" delay={0.7} stagger={0.05} style={{ marginTop: 28 }} />
        <motion.div
          initial={initial}
          animate={step >= 1 ? 'shown' : 'hidden'}
          variants={{ hidden: { opacity: 0, scale: 0.4, rotate: -8 }, shown: { opacity: 1, scale: 1, rotate: -3 } }}
          transition={t.spring('bouncy')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 22,
            marginTop: 72,
            padding: '22px 40px',
            borderRadius: 999,
            border: '4px solid var(--john)',
            background: 'rgba(91,141,239,0.12)',
            originX: 0,
          }}
        >
          <span style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--john)', transform: 'rotate(45deg)' }} />
          <span style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.02em' }}>Project X</span>
        </motion.div>
      </div>
    </div>
  )
}

function Pill({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className="mono" style={{ fontSize: 22, fontWeight: 700, color, border: `2px solid ${color}`, borderRadius: 999, padding: '4px 16px' }}>
      {children}
    </span>
  )
}

/** Step 0: the agent writes the code. Step 1: another agent reviews it. Step 2: CI goes green. */
function AiBuilds() {
  const { step, initial, t } = useSlide()
  const card = (at: number) => ({
    initial,
    animate: step >= at ? 'shown' : 'hidden',
    variants: { hidden: { opacity: 0, x: 60, scale: 0.92 }, shown: { opacity: 1, x: 0, scale: 1 } },
    transition: t.spring('bouncy'),
  })
  return (
    <div className="slide" style={{ flexDirection: 'row', alignItems: 'center', gap: 48, padding: '100px 100px 150px' }}>
      <div style={{ width: 1190, flex: 'none' }}>
        <CodeBlock
          code={EVENTS_CODE}
          filename="lib/events.ts"
          steps={[{ lines: [] }]}
          fontSize={26}
          typeOn={{ cps: 62, delay: 0.5 }}
          badge={<Pill color="var(--ink-2)">✦ written by AI agent</Pill>}
        />
      </div>
      <div style={{ width: 482, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <motion.div
          {...card(1)}
          style={{ padding: '36px 40px', background: 'var(--surface)', border: '2px solid var(--surface-2)', borderRadius: 28 }}
        >
          <div className="label" style={{ fontSize: 24 }}>
            Code review
          </div>
          <div style={{ fontSize: 42, fontWeight: 750, marginTop: 14, lineHeight: 1.15 }}>Reviewed by an AI agent</div>
          <div style={{ fontSize: 32, color: 'var(--ink-2)', marginTop: 18 }}>“LGTM. Clean and readable.”</div>
          <div style={{ marginTop: 22 }}>
            <Pill color="var(--ok)">✓ Approved</Pill>
          </div>
        </motion.div>
        <motion.div
          {...card(2)}
          style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '30px 40px', background: 'var(--surface)', border: '2px solid var(--surface-2)', borderRadius: 28 }}
        >
          <svg viewBox="0 0 260 260" width={130} height={130} style={{ flex: 'none' }}>
            <DrawPath d="M130,20 A110,110 0 1,1 129.9,20" at={2} stroke="var(--ok)" width={16} />
            <DrawPath d="M78,135 L115,172 L185,96" at={2} delay={0.45} stroke="var(--ok)" width={22} spring="soft" />
          </svg>
          <div>
            <div style={{ fontSize: 44, fontWeight: 750, color: 'var(--ok)' }}>CI passed</div>
            <div className="mono" style={{ fontSize: 22, color: 'var(--ink-2)', marginTop: 8, whiteSpace: 'nowrap' }}>
              42 tests · 0 failed
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ---------- John's plan: his thought process ---------- */

function ApiIcon() {
  return (
    <span className="mono" style={{ fontSize: 40, fontWeight: 700, color: 'var(--ink)' }}>
      {'{ }'}
    </span>
  )
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 64 64" width={56} height={56}>
      <path d="M32,4 C34,22 42,30 60,32 C42,34 34,42 32,60 C30,42 22,34 4,32 C22,30 30,22 32,4 Z" fill="var(--ink)" />
    </svg>
  )
}

const PLAN: { icon: ReactNode; text: string; sub: string }[] = [
  { icon: <AtomIcon />, text: 'React. Obviously.', sub: "I'm a big React fan. React + Vite for the frontend." },
  { icon: <ApiIcon />, text: '+ a small API with Express', sub: 'Just enough backend to serve the events.' },
  { icon: <SparkIcon />, text: 'And ship it fast.', sub: 'My AI agent can write most of it.' },
]

/** John thinks the project through. One idea per click. */
function JohnPlans() {
  const { step, initial, t } = useSlide()
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
        style={{ position: 'absolute', left: 150, bottom: 90 }}
      >
        <Avatar who="john" size={460} mood={step >= 2 ? 'happy' : 'neutral'} />
      </motion.div>
      {dot(30, 0.3, 520, 560)}
      {dot(48, 0.4, 580, 480)}
      <motion.div
        initial={initial === false ? false : { opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={t.spring('bouncy', 0.5)}
        style={{
          position: 'absolute',
          left: 640,
          top: 110,
          width: 1140,
          padding: '52px 72px 60px',
          background: 'var(--surface-2)',
          borderRadius: 72,
          originX: 0,
          originY: 1,
        }}
      >
        <div className="label" style={{ fontSize: 28, color: 'var(--ink-2)' }}>
          John thinks…
        </div>
        {PLAN.map((p, i) => (
          <motion.div
            key={i}
            initial={initial}
            animate={step >= i ? 'shown' : 'hidden'}
            variants={{ hidden: { opacity: 0, x: -40 }, shown: { opacity: 1, x: 0 } }}
            transition={t.spring('bouncy', i === 0 ? 0.8 : 0)}
            style={{ display: 'flex', alignItems: 'center', gap: 36, marginTop: 44 }}
          >
            <span style={{ flex: 'none', width: 104, height: 104, borderRadius: 28, background: 'var(--surface)', display: 'grid', placeItems: 'center' }}>
              {p.icon}
            </span>
            <div>
              <div style={{ fontSize: 60, fontWeight: 750, letterSpacing: '-0.02em' }}>{p.text}</div>
              <div style={{ fontSize: 32, color: 'var(--ink-2)', marginTop: 6 }}>{p.sub}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ---------- Shipped: Project X goes live, the boss is happy ---------- */

const EVENTS = ['React Montréal · Nov 12', 'AI Night · Nov 19', '/dev/mtl · Nov 27']

/** Step 0: the deploy bar fills and Project X goes live. Step 1: the boss is thrilled. */
function Shipped() {
  const { step, initial, t } = useSlide()
  const happy = step >= 1
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* The live app */}
      <motion.div
        initial={initial === false ? false : { opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t.spring('soft')}
        style={{ position: 'absolute', left: 140, top: 150, width: 1000, borderRadius: 24, overflow: 'hidden', background: 'var(--surface)', border: '2px solid var(--surface-2)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 28px', background: 'var(--surface-2)' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c, opacity: 0.8 }} />
          ))}
          <span className="mono" style={{ marginLeft: 20, flex: 1, padding: '8px 20px', borderRadius: 12, background: 'var(--bg)', fontSize: 24, color: 'var(--ink-2)' }}>
            project-x.example.com/events
          </span>
        </div>
        {/* Deploy progress */}
        <motion.div
          initial={initial === false ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={t.tween(1.4, 0.4, 'easeInOut')}
          style={{ height: 6, background: 'var(--ok)', originX: 0 }}
        />
        <div style={{ padding: '40px 48px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--john)', transform: 'rotate(45deg)' }} />
            <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.02em' }}>Project X</span>
            <span className="label" style={{ fontSize: 24, marginLeft: 12 }}>
              Events
            </span>
          </div>
          {EVENTS.map((e, i) => (
            <motion.div
              key={e}
              initial={initial === false ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={t.spring('soft', 1.6 + i * 0.1)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, padding: '24px 32px', borderRadius: 18, background: 'var(--surface-2)' }}
            >
              <span style={{ fontSize: 34, fontWeight: 650 }}>{e}</span>
              <span style={{ fontSize: 26, fontWeight: 700, padding: '10px 24px', borderRadius: 12, background: 'var(--ink)', color: 'var(--bg)' }}>Reserve seat</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
      {/* Live badge */}
      <motion.div
        initial={initial === false ? false : { opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={t.spring('bouncy', 1.9)}
        style={{
          position: 'absolute',
          left: 140,
          top: 80,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '10px 26px',
          borderRadius: 999,
          border: '3px solid var(--ok)',
          background: 'rgba(61,220,132,0.12)',
          originX: 0,
        }}
      >
        <span style={{ width: 16, height: 16, borderRadius: 8, background: 'var(--ok)' }} />
        <span className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--ok)', letterSpacing: '0.04em' }}>
          LIVE IN PRODUCTION
        </span>
      </motion.div>
      {/* The boss, thrilled */}
      <motion.div
        initial={initial}
        animate={happy ? 'shown' : 'hidden'}
        variants={{ hidden: { opacity: 0, y: 80 }, shown: { opacity: 1, y: 0 } }}
        transition={t.spring('bouncy')}
        style={{ position: 'absolute', left: 1240, top: 150, width: 560, textAlign: 'center' }}
      >
        <div style={{ display: 'inline-block' }}>
          <Avatar who="boss" size={300} mood={happy ? 'happy' : 'neutral'} />
        </div>
        <div className="label" style={{ fontSize: 26, color: 'var(--boss)', marginTop: 12 }}>
          Boss
        </div>
      </motion.div>
      <motion.div
        initial={initial}
        animate={happy ? 'shown' : 'hidden'}
        variants={{ hidden: { opacity: 0, scale: 0.4 }, shown: { opacity: 1, scale: 1 } }}
        transition={t.spring('bouncy', 0.3)}
        style={{
          position: 'absolute',
          left: 1240,
          top: 560,
          width: 560,
          padding: '40px 48px',
          background: 'var(--surface-2)',
          borderRadius: '48px 12px 48px 48px',
          fontSize: 50,
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '-0.015em',
          originX: 1,
          originY: 0,
        }}
      >
        <Typewriter text="Live before Friday? Amazing. Great job, John!" at={1} delay={0.6} cps={30} />
      </motion.div>
    </div>
  )
}

const slides: SlideDef[] = [
  // Step 1 holds on black while you walk on; the click types the line.
  { id: 'cold-open', title: 'Who made the decision?', chapter: CH, steps: 2, noJourney: true, Component: () => <WhoDecided at={1} /> },
  { id: 'title', title: 'Title', chapter: CH, steps: 1, Component: Title },
  { id: 'card-project-x', title: 'Chapter 1 · Project X', chapter: CH, steps: 1, Component: () => <ChapterCard n={CH} /> },
  { id: 'meet-john', title: 'Meet John Doe', chapter: CH, steps: 2, Component: MeetJohn },
  {
    id: 'boss-best',
    title: 'Boss: a booking app for Friday',
    chapter: CH,
    steps: 1,
    Component: () => <BossSays text="I have an idea: a booking app. The next best application. Let's build something quick for Friday." />,
  },
  { id: 'john-plans', title: "John's plan: React + Express", chapter: CH, steps: PLAN.length, Component: JohnPlans },
  { id: 'ai-builds', title: 'Written, reviewed, green', chapter: CH, steps: 3, Component: AiBuilds },
  { id: 'shipped', title: 'Live in production, boss happy', chapter: CH, steps: 2, Component: Shipped },
]

export default slides
