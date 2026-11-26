import { motion, AnimatePresence } from 'motion/react'
import type { ReactNode } from 'react'
import { Avatar } from '../components/Avatar'
import { DrawPath } from '../components/Diagram'
import { BossSays, ChapterCard } from '../components/Story'
import { useSlide } from '../deck/SlideContext'
import type { SlideDef } from '../deck/types'

const CH = 3

/* ---------- Version two: real business logic ---------- */

const V2_FEATURES = ['Event details', 'Speakers', 'Capacity rules', 'Waitlists', 'Reservations that never double-book a seat']

const V2_CAPTIONS: { text: string; sub?: string }[] = [
  { text: '' },
  { text: 'That’s real business logic.', sub: 'It can’t live in the browser. John needs a real server.' },
]

/**
 * What the boss's "version two" means. The features land in one breath.
 * Step 1: that's business logic, so John needs a real server.
 */
function VersionTwo() {
  const { step, initial, t } = useSlide()
  const caption = V2_CAPTIONS[Math.min(step, V2_CAPTIONS.length - 1)]
  return (
    <div className="slide" style={{ flexDirection: 'row', gap: 110, alignItems: 'center' }}>
      <motion.div initial={initial === false ? false : { opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={t.spring('bouncy')} style={{ flex: 'none' }}>
        <Avatar who="john" size={440} mood={step >= 1 ? 'neutral' : 'worried'} />
      </motion.div>
      <div style={{ width: 1080 }}>
        <div className="label" style={{ fontSize: 30, color: 'var(--boss)' }}>
          Project X · version two
        </div>
        <div style={{ marginTop: 26, display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          {V2_FEATURES.map((feature, i) => (
            <motion.span
              key={feature}
              initial={initial === false ? false : { opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={t.spring('bouncy', 0.3 + i * 0.35)}
              style={{
                padding: '18px 32px',
                borderRadius: 20,
                background: 'var(--surface)',
                border: '2px solid var(--surface-2)',
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: '-0.015em',
                whiteSpace: 'nowrap',
              }}
            >
              {feature}
            </motion.span>
          ))}
        </div>
        <div style={{ position: 'relative', height: 200, marginTop: 70 }}>
          <AnimatePresence initial={false} mode="popLayout">
            {caption.text && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={t.spring('snappy')}
              >
                <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{caption.text}</div>
                {caption.sub && (
                  <div className="body" style={{ marginTop: 18 }}>
                    {caption.sub}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ---------- React + Vite + Express → Next.js ---------- */

function Check({ at, delay, children, color = 'var(--ok)' }: { at: number; delay: number; children: ReactNode; color?: string }) {
  const { step } = useSlide()
  const done = step >= at
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 26 }}>
      <svg viewBox="0 0 80 80" width={56} height={56} style={{ flex: 'none' }}>
        <motion.rect
          x={4}
          y={4}
          width={72}
          height={72}
          rx={18}
          initial={false}
          animate={{ fill: done ? 'rgba(61,220,132,0.14)' : 'rgba(61,220,132,0)', stroke: done ? '#3ddc84' : '#3a4252' }}
          strokeWidth={4}
        />
        <DrawPath d="M22,42 L35,55 L59,27" at={at} delay={delay} stroke={color} width={8} spring="soft" />
      </svg>
      <motion.span
        initial={false}
        animate={{ opacity: done ? 1 : 0.35 }}
        transition={{ duration: 0.3, delay: done ? delay : 0 }}
        style={{ fontSize: 40, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap' }}
      >
        {children}
      </motion.span>
    </div>
  )
}

const MOVE_TITLES: { text: string; lead?: string }[] = [
  { text: '' },
  { text: '' },
  { text: 'A product decision, not a telemetry one.' },
  { text: 'That’s exactly where OpenTelemetry is mature.', lead: 'And then John notices something. He now has a server…' },
]

/**
 * Step 1: v1's separate pieces (Vite frontend, Express API) merge into one Next.js box. React stays.
 * Step 2: the two product reasons tick. Step 3: after the decision, John discovers the server is where OpenTelemetry is mature.
 */
function NextMove() {
  const { step, initial, t } = useSlide()
  const next = step >= 1
  const title = MOVE_TITLES[Math.min(step, MOVE_TITLES.length - 1)]
  const box = {
    height: 200,
    borderRadius: 28,
    background: 'var(--surface)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
  }
  return (
    <div className="slide" style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 200 }}>
      <motion.div
        initial={initial === false ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t.spring('bouncy')}
        style={{ display: 'flex', alignItems: 'center', gap: 28 }}
      >
        <div style={{ ...box, width: 340, border: '3px solid var(--line)' }}>
          <div style={{ fontSize: 52, fontWeight: 750 }}>React</div>
          <div className="mono" style={{ fontSize: 26, color: 'var(--ink-2)', marginTop: 8 }}>
            stays
          </div>
        </div>
        <span style={{ fontSize: 64, color: 'var(--muted)', fontWeight: 300 }}>+</span>
        <motion.div
          initial={false}
          animate={{ width: next ? 440 : 400, borderColor: next ? '#f6f7f9' : '#3a4252', scale: next ? [1, 1.06, 1] : 1 }}
          transition={{ ...t.spring('bouncy'), scale: t.tween(0.5, 0.1) }}
          style={{ ...box, border: '3px solid', position: 'relative', overflow: 'hidden' }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={next ? 'next' : 'v1'}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -60 }}
              transition={t.spring('snappy')}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: 52, fontWeight: 750 }}>{next ? 'Next.js' : 'Vite + Express'}</div>
              <div className="mono" style={{ fontSize: 26, color: 'var(--ink-2)', marginTop: 8 }}>
                {next ? 'pages + a real server' : 'thin API'}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div
        initial={initial === false ? false : { opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={t.spring('soft', 0.2)}
        style={{ width: 660 }}
      >
        <div className="label" style={{ fontSize: 30, color: 'var(--ink-2)' }}>
          Why Next.js
        </div>
        <Check at={2} delay={0}>
          A server for the business logic
        </Check>
        <Check at={2} delay={0.3}>
          Keep React: the team knows it
        </Check>
        <div style={{ marginTop: 40 }}>
          <Check at={3} delay={0.4}>
            Bonus: telemetry on the server
          </Check>
        </div>
      </motion.div>
      <div style={{ position: 'absolute', left: 140, right: 140, top: 790, height: 120 }}>
        <AnimatePresence initial={false} mode="popLayout">
          {title.text && (
            <motion.div
              key={title.text}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={t.spring('soft', step === 2 ? 0.8 : 0.3)}
            >
              {title.lead && (
                <div className="body" style={{ fontSize: 40, color: 'var(--ink-2)', marginBottom: 14, whiteSpace: 'nowrap' }}>
                  {title.lead}
                </div>
              )}
              <div className="title" style={{ fontSize: 64, whiteSpace: 'nowrap' }}>
                {title.text}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const slides: SlideDef[] = [
  { id: 'card-nextjs', title: 'Chapter 4 · Next.js', chapter: CH, steps: 1, Component: () => <ChapterCard n={CH} /> },
  { id: 'boss-v2', title: 'Boss: now we need version two', chapter: CH, steps: 1, Component: () => <BossSays text="Users love Project X. Now we need version two." john="happy" /> },
  { id: 'version-two', title: 'Version two: real business logic', chapter: CH, steps: 2, Component: VersionTwo },
  { id: 'next-move', title: 'React + Vite + Express → Next.js', chapter: CH, steps: 4, Component: NextMove },
]

export default slides
