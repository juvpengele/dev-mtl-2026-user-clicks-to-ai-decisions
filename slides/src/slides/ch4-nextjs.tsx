import { motion, AnimatePresence } from 'motion/react'
import type { ReactNode } from 'react'
import { Avatar } from '../components/Avatar'
import { DrawPath } from '../components/Diagram'
import { AtomIcon, SearchIcon, SignalIcon } from '../components/Icons'
import { BossSays, ChapterCard } from '../components/Story'
import { Words } from '../components/Words'
import { useSlide } from '../deck/SlideContext'
import type { SlideDef } from '../deck/types'

const CH = 3

function NeedRow({ at, icon, text, from, fromColor }: { at: number; icon: ReactNode; text: string; from: string; fromColor: string }) {
  const { step, initial, t } = useSlide()
  return (
    <motion.div
      initial={initial}
      animate={step >= at ? 'shown' : 'hidden'}
      variants={{ hidden: { opacity: 0, x: -50 }, shown: { opacity: 1, x: 0 } }}
      transition={t.spring('bouncy', at === 0 ? 0.5 : 0)}
      style={{ display: 'flex', alignItems: 'center', gap: 40, marginTop: 48 }}
    >
      <span style={{ width: 120, height: 120, borderRadius: 30, background: 'var(--surface)', border: '2px solid var(--surface-2)', display: 'grid', placeItems: 'center', flex: 'none' }}>
        {icon}
      </span>
      <div>
        <div style={{ fontSize: 68, fontWeight: 750, letterSpacing: '-0.02em' }}>{text}</div>
        <div className="label" style={{ fontSize: 26, marginTop: 6, color: fromColor }}>
          {from}
        </div>
      </div>
    </motion.div>
  )
}

function Needs() {
  const { initial, t } = useSlide()
  return (
    <div className="slide" style={{ flexDirection: 'row', gap: 120 }}>
      <motion.div initial={initial === false ? false : { opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={t.spring('bouncy')}>
        <Avatar who="john" size={500} />
      </motion.div>
      <div>
        <Words text="What John needs" className="label" style={{ fontSize: 34, color: 'var(--ink-2)' }} />
        <NeedRow at={0} icon={<SearchIcon />} text="Good SEO" from="the boss wants it" fromColor="var(--boss)" />
        <NeedRow at={1} icon={<AtomIcon />} text="Keep React" from="John loves it · v1 is React" fromColor="var(--john)" />
        <NeedRow at={2} icon={<SignalIcon />} text="Reliable telemetry" from="from the conference" fromColor="var(--ink-2)" />
      </div>
    </div>
  )
}

function Check({ at, delay, children }: { at: number; delay: number; children: ReactNode }) {
  const { step } = useSlide()
  const done = step >= at
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 30 }}>
      <svg viewBox="0 0 80 80" width={64} height={64} style={{ flex: 'none' }}>
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
        <DrawPath d="M22,42 L35,55 L59,27" at={at} delay={delay} stroke="var(--ok)" width={8} spring="soft" />
      </svg>
      <span style={{ fontSize: 46, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{children}</span>
    </div>
  )
}

/**
 * Step 1: v1's separate pieces (Vite frontend, Express API) merge into one Next.js box. React stays.
 * Step 2: John's needs tick one after another.
 */
function NextMove() {
  const { step, initial, t } = useSlide()
  const next = step >= 1
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
          animate={{ width: next ? 470 : 400, borderColor: next ? '#f6f7f9' : '#3a4252', scale: next ? [1, 1.06, 1] : 1 }}
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
                {next ? 'frontend + backend' : 'two separate apps'}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div
        initial={initial === false ? false : { opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={t.spring('soft', 0.2)}
        style={{ width: 720 }}
      >
        <div className="label" style={{ fontSize: 30, color: 'var(--ink-2)' }}>
          What John needs
        </div>
        <Check at={2} delay={0}>
          SEO: server rendering
        </Check>
        <Check at={2} delay={0.3}>
          React stays
        </Check>
        <Check at={2} delay={0.6}>
          Front + back, one app
        </Check>
        <Check at={2} delay={0.9}>
          Telemetry on the server
        </Check>
      </motion.div>
      <div style={{ position: 'absolute', left: 140, right: 140, top: 790 }}>
        <Words text="React stays. One app, front and back." className="title" at={2} delay={1.4} stagger={0.14} spring="slow" style={{ fontSize: 84, whiteSpace: "nowrap" }} />
      </div>
    </div>
  )
}

const slides: SlideDef[] = [
  { id: 'card-nextjs', title: 'Chapter 4 · Next.js', chapter: CH, steps: 1, Component: () => <ChapterCard n={CH} /> },
  { id: 'boss-seo', title: 'Boss: we need SEO', chapter: CH, steps: 1, Component: () => <BossSays text="We need good SEO. People have to find Project X." john="worried" /> },
  { id: 'needs', title: 'What John needs', chapter: CH, steps: 3, Component: Needs },
  { id: 'next-move', title: 'React + Express → Next.js', chapter: CH, steps: 3, Component: NextMove },
]

export default slides
