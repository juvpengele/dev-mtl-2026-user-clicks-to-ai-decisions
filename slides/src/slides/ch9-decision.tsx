import { motion } from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'
import type { ReactNode } from 'react'
import { DrawPath, Svg } from '../components/Diagram'
import { ChapterCard } from '../components/Story'
import { Words } from '../components/Words'
import { talk } from '../config'
import { useSlide } from '../deck/SlideContext'
import type { SlideDef } from '../deck/types'
import { WhoDecided } from './WhoDecided'
import feedbackQr from '../assets/glodie-juvenal-pengele.png'

// Three QR cards side by side: sized so they fit next to the "Thank you" column.
const QR_BOX = 270
const QR_PAD = 18
const QR_SIZE = QR_BOX - QR_PAD * 2
// The feedback PNG's quiet zone is ~10.6% per side (120px of 1130px); scale it up to trim it.
const FEEDBACK_CROP = 1130 / (1130 - 2 * 120)

const CH = 8

/* ---------- The full loop ---------- */

const C = { x: 960, y: 540, rx: 560, ry: 330 }
const rad = (deg: number) => (deg * Math.PI) / 180
const pt = (deg: number): [number, number] => [C.x + C.rx * Math.cos(rad(deg)), C.y + C.ry * Math.sin(rad(deg))]

/** Clockwise arc along the ellipse, plus an arrowhead tangent to it at the end. */
function arc(a1: number, a2: number) {
  const [x1, y1] = pt(a1)
  const [x2, y2] = pt(a2)
  const head = (Math.atan2(C.ry * Math.cos(rad(a2)), -C.rx * Math.sin(rad(a2))) * 180) / Math.PI
  return { d: `M${x1},${y1} A${C.rx},${C.ry} 0 0 1 ${x2},${y2}`, end: [x2, y2] as const, head }
}

// Nodes sit at the top, right, bottom and left of the ellipse.
const NODES = [
  { deg: -90, text: 'AI wrote the code' },
  { deg: 0, text: 'Observability recorded what it did' },
  { deg: 90, text: 'Agents read the traces' },
  { deg: 180, text: 'John decided' },
]
const ARCS = [arc(-58, -26), arc(26, 58), arc(122, 154), arc(206, 238)]
// [step, delay] for each arc: arcs 1–3 lead into nodes 2–4; the last one closes the loop.
const ARC_AT: [number, number][] = [
  [1, 0],
  [2, 0],
  [3, 0],
  [3, 1.2],
]
const EMPHASIS_DELAY = 2.2

function ArcArrow({ i }: { i: number }) {
  const { step, initial, t } = useSlide()
  const [at, delay] = ARC_AT[i]
  const { d, end, head } = ARCS[i]
  return (
    <g>
      <DrawPath d={d} at={at} delay={delay} width={5} />
      <motion.path
        d="M-24,-14 L0,0 L-24,14"
        fill="none"
        stroke="var(--line)"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={`translate(${end[0]},${end[1]}) rotate(${head})`}
        initial={initial}
        animate={step >= at ? 'shown' : 'hidden'}
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
        transition={t.spring('snappy', delay + 0.9)}
      />
    </g>
  )
}

function Loop() {
  const { step, initial, t } = useSlide()
  const emphasis = step >= 3
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Svg>
        {ARCS.map((_, i) => (
          <ArcArrow key={i} i={i} />
        ))}
      </Svg>
      {NODES.map((n, i) => {
        const [x, y] = pt(n.deg)
        const john = i === 3
        return (
          <motion.div
            key={i}
            initial={initial}
            animate={step >= i ? 'shown' : 'hidden'}
            variants={{ hidden: { opacity: 0, scale: 0.7 }, shown: { opacity: 1, scale: 1 } }}
            transition={t.spring('bouncy', i === 0 ? 0 : 0.8)}
            style={{
              position: 'absolute',
              left: x - (john ? 300 : 260),
              top: y - 80,
              width: john ? 600 : 520,
              height: 160,
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
            }}
          >
            <motion.span
              animate={john && emphasis ? { scale: 1.22, color: '#f6f7f9' } : { scale: 1, color: john ? '#f6f7f9' : '#b9c0cc' }}
              transition={t.spring('bouncy', john && emphasis ? EMPHASIS_DELAY : 0)}
              style={{ display: 'inline-block', fontSize: john ? 72 : 48, fontWeight: john ? 800 : 650, lineHeight: 1.2 }}
            >
              {n.text}
              {john && (
                <motion.span
                  initial={initial}
                  animate={emphasis ? 'shown' : 'hidden'}
                  variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                  transition={t.spring('soft', EMPHASIS_DELAY + 0.15)}
                  style={{ display: 'block', height: 8, borderRadius: 4, background: 'var(--john)', originX: 0.5, marginTop: 10 }}
                />
              )}
            </motion.span>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ---------- Takeaways ---------- */

const TAKEAWAYS = [
  'Start the trace where the user is.',
  'Use OpenTelemetry so your observability outlives your code and your vendors.',
  'Give your spans meaning, for humans and for agents.',
]

function Takeaways() {
  const { step, initial, t } = useSlide()
  return (
    <div className="slide left">
      <div className="label" style={{ marginBottom: 56 }}>
        Takeaways
      </div>
      {TAKEAWAYS.map((text, i) => (
        <motion.div
          key={i}
          initial={initial}
          animate={step >= i ? 'shown' : 'hidden'}
          variants={{ hidden: { opacity: 0, x: -50 }, shown: { opacity: 1, x: 0 } }}
          transition={t.spring('soft')}
          style={{ display: 'flex', gap: 48, alignItems: 'baseline', marginBottom: 64, maxWidth: 1560 }}
        >
          <span className="mono" style={{ fontSize: 64, fontWeight: 700, color: 'var(--muted)', flex: 'none' }}>
            {i + 1}.
          </span>
          <motion.span
            animate={{ color: step === i ? '#f6f7f9' : '#b9c0cc' }}
            transition={t.spring('soft')}
            style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' }}
          >
            {text}
          </motion.span>
        </motion.div>
      ))}
    </div>
  )
}

/* ---------- Closing + thanks ---------- */

function Closing() {
  return (
    <div className="slide">
      <Words text="Observe the AI's decisions." className="title" stagger={0.24} spring="slow" highlight={{ Observe: 'accent' }} />
      <Words text="Don't just trust them." className="title" delay={1.3} stagger={0.24} spring="slow" style={{ marginTop: 16, color: 'var(--ink-2)' }} />
    </div>
  )
}

function QrCard({ label, children, delay }: { label: string; children: ReactNode; delay: number }) {
  const { initial, t } = useSlide()
  return (
    <motion.div
      initial={initial === false ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={t.spring('bouncy', delay)}
      style={{ textAlign: 'center' }}
    >
      <div style={{ width: QR_BOX, height: QR_BOX, padding: QR_PAD, background: '#f6f7f9', borderRadius: 24, lineHeight: 0 }}>{children}</div>
      <div className="label" style={{ marginTop: 20, fontSize: 26, color: 'var(--ink-2)' }}>
        {label}
      </div>
    </motion.div>
  )
}

function Thanks() {
  const { initial, t } = useSlide()
  const fade = (delay: number) => ({
    initial: initial === false ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: t.spring('soft', delay),
  })
  return (
    <div className="slide" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 160 }}>
      <div>
        <Words text="Thank you" className="huge" spring="bouncy" style={{ fontSize: 140 }} />
        <motion.div {...fade(0.3)} className="label" style={{ fontSize: 36, marginTop: 24, color: 'var(--ink-2)' }}>
          Questions?
        </motion.div>
        <motion.div {...fade(0.5)} style={{ fontSize: 56, fontWeight: 750, marginTop: 64 }}>
          {talk.speaker}
        </motion.div>
        <motion.div {...fade(0.65)} className="mono" style={{ fontSize: 36, color: 'var(--ink-2)', marginTop: 16 }}>
          {talk.contact}
        </motion.div>
        <motion.div {...fade(0.8)} className="mono" style={{ fontSize: 28, color: 'var(--ink-2)', marginTop: 12 }}>
          {/* Long repo names: break after the owner, never mid-word. */}
          {talk.repoUrl
            .replace(/^https?:\/\//, '')
            .split(/(?<=\/)(?=[^/]*$)/)
            .map((part) => (
              <div key={part} style={{ whiteSpace: 'nowrap' }}>
                {part}
              </div>
            ))}
        </motion.div>
      </div>
      <div style={{ display: 'flex', gap: 32 }}>
        <QrCard label="LinkedIn" delay={0.9}>
          <QRCodeSVG value={talk.linkedinUrl} size={QR_SIZE} bgColor="#f6f7f9" fgColor="#050608" level="M" />
        </QrCard>
        <QrCard label="Demo repo" delay={1.05}>
          {/* Generated locally at render time: no network needed. */}
          <QRCodeSVG value={talk.repoUrl} size={QR_SIZE} bgColor="#f6f7f9" fgColor="#050608" level="M" />
        </QrCard>
        <QrCard label="Feedback" delay={1.2}>
          {/* The PNG has a wide white border baked in: crop it so it matches the generated codes. */}
          <div style={{ position: 'relative', width: QR_SIZE, height: QR_SIZE, overflow: 'hidden' }}>
            <img
              src={feedbackQr}
              alt="Feedback QR code"
              width={QR_SIZE * FEEDBACK_CROP}
              height={QR_SIZE * FEEDBACK_CROP}
              style={{ position: 'absolute', left: (QR_SIZE * (1 - FEEDBACK_CROP)) / 2, top: (QR_SIZE * (1 - FEEDBACK_CROP)) / 2, maxWidth: 'none' }}
            />
          </div>
        </QrCard>
      </div>
    </div>
  )
}

const slides: SlideDef[] = [
  { id: 'card-decision', title: 'Chapter 9 · The decision', chapter: CH, steps: 1, Component: () => <ChapterCard n={CH} /> },
  { id: 'who-decided-again', title: 'Who made the decision? (callback)', chapter: CH, steps: 1, Component: () => <WhoDecided delay={0.6} /> },
  { id: 'loop', title: 'The full loop', chapter: CH, steps: 4, Component: Loop },
  { id: 'takeaways', title: 'Three takeaways', chapter: CH, steps: TAKEAWAYS.length, Component: Takeaways },
  { id: 'closing', title: 'Observe, don’t just trust', chapter: CH, steps: 1, Component: Closing },
  { id: 'thanks', title: 'Thank you + Q&A', chapter: CH, steps: 1, Component: Thanks },
]

export default slides
