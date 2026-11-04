import { motion } from 'motion/react'
import { useSlide } from '../deck/SlideContext'

export interface Span {
  name: string
  /** Shown under the name, e.g. "browser", "next.js", "postgres". */
  service: string
  /** Start and duration in trace milliseconds. */
  start: number
  dur: number
  depth: number
}

const NAME_W = 560
const AXIS_H = 70
const ROW_H = 104
const BAR_H = 48

/**
 * A trace waterfall whose bars grow left to right in time order, replaying the
 * trace at `speed` trace-milliseconds per real second.
 */
export function Waterfall({
  spans,
  maxMs,
  ticks,
  at = 0,
  delay = 0,
  speed = 80,
  width = 1640,
}: {
  spans: Span[]
  maxMs: number
  ticks: number[]
  at?: number
  delay?: number
  speed?: number
  width?: number
}) {
  const { step, initial, t } = useSlide()
  const state = step >= at ? 'shown' : 'hidden'
  const px = (ms: number) => (ms / maxMs) * (width - NAME_W)

  return (
    <div style={{ position: 'relative', width, height: AXIS_H + spans.length * ROW_H }}>
      {ticks.map((ms) => (
        <div
          key={ms}
          style={{ position: 'absolute', left: NAME_W + px(ms), top: 0, bottom: 0, borderLeft: '2px solid var(--surface-2)' }}
        >
          <span className="mono" style={{ position: 'absolute', left: 10, top: 0, fontSize: 24, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            {ms} ms
          </span>
        </div>
      ))}
      {spans.map((s, i) => {
        const begin = delay + s.start / speed
        const grow = s.dur / speed
        return (
          <div key={i} style={{ position: 'absolute', left: 0, top: AXIS_H + i * ROW_H, width, height: ROW_H }}>
            <motion.div
              initial={initial}
              animate={state}
              variants={{ hidden: { opacity: 0, x: -20 }, shown: { opacity: 1, x: 0 } }}
              transition={t.tween(0.3, begin, 'easeOut')}
              style={{ position: 'absolute', left: s.depth * 40, top: 16, width: NAME_W - s.depth * 40 - 24 }}
            >
              <div style={{ fontSize: 34, fontWeight: 650, whiteSpace: 'nowrap' }}>{s.name}</div>
              <div className="mono" style={{ fontSize: 22, color: 'var(--muted)', marginTop: 4 }}>
                {s.service}
              </div>
            </motion.div>
            <motion.div
              initial={initial}
              animate={state}
              variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
              transition={t.tween(grow, begin, 'linear')}
              style={{
                position: 'absolute',
                left: NAME_W + px(s.start),
                top: (ROW_H - BAR_H) / 2,
                width: px(s.dur),
                height: BAR_H,
                borderRadius: 10,
                background: s.depth === 0 ? 'var(--trace)' : s.depth === 1 ? 'rgba(255,178,36,0.75)' : 'rgba(255,178,36,0.5)',
                originX: 0,
                boxShadow: s.depth === 0 ? '0 0 24px var(--trace-glow)' : undefined,
              }}
            />
            <motion.span
              className="mono"
              initial={initial}
              animate={state}
              variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
              transition={t.tween(0.25, begin + grow)}
              style={{
                position: 'absolute',
                left: NAME_W + px(s.start + s.dur) + 16,
                top: ROW_H / 2 - 16,
                fontSize: 26,
                color: 'var(--ink-2)',
                whiteSpace: 'nowrap',
              }}
            >
              {s.dur} ms
            </motion.span>
          </div>
        )
      })}
    </div>
  )
}
