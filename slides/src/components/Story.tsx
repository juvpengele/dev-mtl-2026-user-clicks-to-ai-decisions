import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { useSlide } from '../deck/SlideContext'
import { CHAPTERS } from '../story'
import { Avatar, type Mood } from './Avatar'
import { Typewriter } from './Typewriter'
import { Words } from './Words'

/** John standing in a corner of a story slide, reacting. */
export function JohnCorner({ mood = 'neutral', delay = 0.4, size = 300, at = 0 }: { mood?: Mood; delay?: number; size?: number; at?: number }) {
  const { step, initial, t } = useSlide()
  return (
    <motion.div
      initial={initial}
      animate={step >= at ? 'shown' : 'hidden'}
      variants={{ hidden: { opacity: 0, y: 60 }, shown: { opacity: 1, y: 0 } }}
      transition={t.spring('bouncy', delay)}
      style={{ position: 'absolute', right: 180, bottom: 76 }}
    >
      <Avatar who="john" size={size} mood={mood} />
      <div className="label" style={{ textAlign: 'center', marginTop: 10, fontSize: 24, color: 'var(--ink-2)' }}>
        John
      </div>
    </motion.div>
  )
}

/** The boss talks in chat bubbles. Each one opens the next turn in the story. */
export function BossSays({ text, john = 'neutral', delay = 0.55 }: { text: string; john?: Mood; delay?: number }) {
  const { initial, t } = useSlide()
  return (
    <div className="slide left" style={{ justifyContent: 'flex-start', paddingTop: 200 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 48 }}>
        <motion.div
          initial={initial === false ? false : { opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={t.spring('bouncy')}
          style={{ flex: 'none', textAlign: 'center' }}
        >
          <BossHead size={190} />
          <div className="label" style={{ marginTop: 14, fontSize: 26, color: 'var(--boss)' }}>
            Boss
          </div>
        </motion.div>
        <motion.div
          initial={initial === false ? false : { opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={t.spring('bouncy', 0.18)}
          style={{
            originX: 0,
            originY: 0,
            marginTop: 40,
            maxWidth: 1180,
            padding: '48px 60px',
            background: 'var(--surface-2)',
            borderRadius: '12px 48px 48px 48px',
            fontSize: 68,
            fontWeight: 650,
            lineHeight: 1.25,
            letterSpacing: '-0.015em',
          }}
        >
          <Typewriter text={text} delay={delay} cps={34} />
        </motion.div>
      </div>
      <JohnCorner mood={john} delay={0.3 + text.length / 34} />
    </div>
  )
}

/** Notification variant: the boss's message slides in like a phone notification. */
export function BossToast({ text, john = 'worried' }: { text: string; john?: Mood }) {
  const { initial, t } = useSlide()
  return (
    <div className="slide left" style={{ justifyContent: 'flex-start', paddingTop: 220 }}>
      <motion.div
        initial={initial === false ? false : { opacity: 0, x: 700 }}
        animate={{ opacity: 1, x: 0 }}
        transition={t.spring('soft', 0.25)}
        style={{
          width: 1260,
          display: 'flex',
          gap: 40,
          padding: '44px 52px',
          background: 'var(--surface)',
          border: '2px solid var(--surface-2)',
          borderRadius: 40,
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        <span style={{ flex: 'none', width: 112, height: 112, borderRadius: 28, background: 'var(--surface-2)', overflow: 'hidden', display: 'grid', placeItems: 'end center' }}>
          <BossHead size={118} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 40, fontWeight: 750, color: 'var(--boss)' }}>Boss</span>
            <span className="mono" style={{ fontSize: 28, color: 'var(--muted)' }}>
              now
            </span>
          </div>
          <div style={{ fontSize: 62, fontWeight: 600, lineHeight: 1.25, marginTop: 14 }}>{text}</div>
        </div>
      </motion.div>
      <JohnCorner mood={john} delay={0.9} />
    </div>
  )
}

function BossHead({ size }: { size: number }) {
  return <Avatar who="boss" size={size} />
}

/** John thinking out loud: a thought bubble above his head. */
export function JohnThinks({ text, mood = 'worried' }: { text: string; mood?: Mood }) {
  const { initial, t } = useSlide()
  const dot = (d: number, delay: number, style: CSSProperties) => (
    <motion.span
      initial={initial === false ? false : { opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={t.spring('bouncy', delay)}
      style={{ position: 'absolute', width: d, height: d, borderRadius: d, background: 'var(--surface-2)', ...style }}
    />
  )
  return (
    <div className="slide" style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 40, paddingBottom: 140 }}>
      <motion.div
        initial={initial === false ? false : { opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t.spring('bouncy')}
        style={{ position: 'relative' }}
      >
        <Avatar who="john" size={460} mood={mood} />
        {dot(28, 0.35, { right: -40, top: 20 })}
        {dot(46, 0.45, { right: -100, top: -50 })}
      </motion.div>
      <motion.div
        initial={initial === false ? false : { opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={t.spring('bouncy', 0.55)}
        style={{
          originX: 0,
          originY: 1,
          alignSelf: 'flex-start',
          marginTop: 40,
          padding: '64px 80px',
          background: 'var(--surface-2)',
          borderRadius: 120,
          fontSize: 84,
          fontWeight: 750,
          letterSpacing: '-0.02em',
        }}
      >
        <Words text={text} delay={0.75} stagger={0.12} />
      </motion.div>
    </div>
  )
}

/** Chapter title card: big outlined number, chapter name in kinetic type. */
export function ChapterCard({ n }: { n: number }) {
  const { initial, t } = useSlide()
  return (
    <div className="slide left">
      <motion.div
        aria-hidden
        className="mono"
        initial={initial === false ? false : { opacity: 0, x: 120 }}
        animate={{ opacity: 1, x: 0 }}
        transition={t.spring('soft')}
        style={{
          position: 'absolute',
          right: 90,
          top: 200,
          fontSize: 520,
          fontWeight: 800,
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '4px #1f242e',
          letterSpacing: '-0.06em',
        }}
      >
        {String(n + 1).padStart(2, '0')}
      </motion.div>
      <motion.div
        className="label"
        initial={initial === false ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t.spring('soft', 0.05)}
        style={{ marginBottom: 28 }}
      >
        Chapter {n + 1} <span style={{ color: 'var(--line)' }}>/ {CHAPTERS.length}</span>
      </motion.div>
      <Words text={CHAPTERS[n]} className="huge" spring="bouncy" stagger={0.1} delay={0.12} style={{ fontSize: 180 }} />
      <motion.div
        initial={initial === false ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={t.spring('soft', 0.4)}
        style={{ width: 240, height: 10, borderRadius: 5, background: 'var(--ink)', originX: 0, marginTop: 56 }}
      />
    </div>
  )
}

/** A centered caption under a diagram. */
export function Caption({ children, top = 860 }: { children: ReactNode; top?: number }) {
  return <div style={{ position: 'absolute', left: 0, right: 0, top, textAlign: 'center' }}>{children}</div>
}
