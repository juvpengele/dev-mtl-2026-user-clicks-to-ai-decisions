import { motion } from 'motion/react'
import { Svg } from '../components/Diagram'
import { BossToast, ChapterCard, JohnCorner } from '../components/Story'
import { Words } from '../components/Words'
import { useSlide } from '../deck/SlideContext'
import type { SlideDef } from '../deck/types'
import { ARCH, ArchBoxes, QuestionMark } from './shared'

const CH = 1
const V1: [string, string | undefined][] = [
  ['Browser', 'React + Vite'],
  ['API', 'Express'],
  ['Database', 'Postgres'],
]
const SUSPECTS = ['React?', 'The API?', 'The database?']

/** A suspect label under a box: pops with its "?" and stays. */
function Suspect({ cx, text, at }: { cx: number; text: string; at: number }) {
  const { step, initial, t } = useSlide()
  return (
    <motion.text
      x={cx}
      y={ARCH.y + 160}
      textAnchor="middle"
      fontSize={54}
      fontWeight={750}
      fill="var(--ink)"
      initial={initial}
      animate={step >= at ? 'shown' : 'hidden'}
      variants={{ hidden: { opacity: 0, y: -20 }, shown: { opacity: 1, y: 0 } }}
      transition={t.spring('bouncy', 0.1)}
    >
      {text}
    </motion.text>
  )
}

/**
 * The bug came first; now John wants to know where it's happening.
 * Step 0: v1's three boxes and the question. Steps 1–3: each suspect gets a "?" and goes dark:
 * he can't see inside any of them. Step 4: "No error. No crash. No idea."
 */
function WhereIsIt() {
  const { step } = useSlide()
  const dimmed = [step >= 1, step >= 2, step >= 3]
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 140, top: 64 }}>
        <Words text="The app is slow. But where?" className="title" stagger={0.1} spring="soft" style={{ fontSize: 68 }} />
      </div>
      <Svg>
        <ArchBoxes labels={V1} dimmed={dimmed} />
        {ARCH.xs.map((cx, i) => (
          <QuestionMark key={i} cx={cx} cy={ARCH.y - 110} at={i + 1} delay={0.1} />
        ))}
        {ARCH.xs.map((cx, i) => (
          <Suspect key={i} cx={cx} text={SUSPECTS[i]} at={i + 1} />
        ))}
      </Svg>
      <div style={{ position: 'absolute', left: 140, top: 740 }}>
        <Words text="No error. No crash. No idea." className="title" at={4} delay={0.3} stagger={0.2} spring="slow" style={{ fontSize: 88 }} />
      </div>
      <JohnCorner mood="worried" size={240} delay={0.6} />
    </div>
  )
}

const slides: SlideDef[] = [
  { id: 'card-the-bug', title: 'Chapter 2 · The bug', chapter: CH, steps: 1, Component: () => <ChapterCard n={CH} /> },
  { id: 'boss-slow', title: 'Boss: the app is slow', chapter: CH, steps: 1, Component: () => <BossToast text="Users say the app is slow." /> },
  { id: 'where-is-it', title: 'Where is it slow? React, API, DB', chapter: CH, steps: 5, Component: WhereIsIt },
]

export default slides
