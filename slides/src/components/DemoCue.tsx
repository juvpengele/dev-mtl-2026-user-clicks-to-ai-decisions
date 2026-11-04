import { motion } from 'motion/react'
import { useSlide } from '../deck/SlideContext'
import { LiveDot } from './Diagram'
import { Typewriter } from './Typewriter'

/** Minimal "switch to the live app now" slide. */
export function DemoCue({ title, prompt }: { title: string; prompt?: string }) {
  const { initial, t } = useSlide()
  return (
    <div className="slide left">
      <motion.div
        initial={initial === false ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t.spring('soft')}
        style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 36 }}
      >
        <LiveDot />
        <span className="label" style={{ color: 'var(--trace)' }}>
          Live demo
        </span>
      </motion.div>
      <motion.h1
        className="title"
        initial={initial === false ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t.spring('soft', 0.1)}
      >
        <span style={{ color: 'var(--muted)' }}>Demo:</span> {title}
      </motion.h1>
      {prompt && (
        <motion.div
          className="mono"
          initial={initial === false ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t.spring('soft', 0.25)}
          style={{
            marginTop: 72,
            padding: '36px 44px',
            background: 'var(--surface)',
            border: '2px solid var(--surface-2)',
            borderRadius: 24,
            fontSize: 44,
            maxWidth: 1640,
          }}
        >
          <span style={{ color: 'var(--trace)' }}>&gt; </span>
          <Typewriter text={prompt} delay={0.6} cps={40} />
        </motion.div>
      )}
    </div>
  )
}
