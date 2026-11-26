import { motion } from 'motion/react'
import { Svg } from '../components/Diagram'
import { CodeBlock } from '../components/CodeBlock'
import { BossToast, Caption, ChapterCard, JohnCorner, JohnThinks } from '../components/Story'
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
 * he can't see inside any of them. Steps 4–6: "No error." / "No crash." / "No idea.", one per click.
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
      <div style={{ position: 'absolute', left: 140, top: 740, display: 'flex', gap: 26 }}>
        {['No error.', 'No crash.', 'No idea.'].map((text, i) => (
          <Words key={text} text={text} className="title" at={4 + i} delay={0.1} stagger={0.15} spring="slow" style={{ fontSize: 88 }} />
        ))}
      </div>
      <JohnCorner mood="worried" size={240} delay={0.6} />
    </div>
  )
}

// v1's real request path, with John's console.logs sprinkled in.
const LOGS_CODE = `// src/App.tsx
console.log('before fetch', Date.now())
const res = await fetch('/api/events')
console.log('after fetch', Date.now())

// api/server.ts
app.get('/api/events', async (req, res) => {
  console.log('inside /api/events')
  console.log('before query', Date.now())
  const events = await getEventsWithSeatsLeft(db)
  console.log('after query', Date.now())
  res.json(events)
})`
// Step 0: the code. 1: before the API call. 2: after it. 3: inside the backend. 4: around the query. 5: all of them.
const LOGS_STEPS = [{ lines: [] }, { lines: [2] }, { lines: [4] }, { lines: [8] }, { lines: [9, 11] }, { lines: [2, 4, 8, 9, 11] }]

/** John does what we all do: console.log everywhere. */
function ConsoleLogs() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 140, top: 64 }}>
        <Words text="So John adds console.log." className="title" stagger={0.1} spring="soft" style={{ fontSize: 68 }} />
      </div>
      <div style={{ position: 'absolute', left: 140, top: 190, width: 1180 }}>
        <CodeBlock code={LOGS_CODE} filename="debugging.ts" steps={LOGS_STEPS} fontSize={30} />
      </div>
      <div style={{ position: 'absolute', left: 1380, top: 300 }}>
        <Words text="Everywhere." className="title" at={5} delay={0.2} spring="bouncy" from="scale" style={{ fontSize: 84 }} />
      </div>
      <JohnCorner mood="worried" size={240} delay={0.6} />
    </div>
  )
}

/** The one question. Step 1: he's still guessing. */
function WhereIsTheTime() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <JohnThinks text="Where is the time going?" />
      <Caption top={930}>
        <Words text="Still guessing." className="label" at={1} stagger={0.1} style={{ fontSize: 40, color: 'var(--ink-2)' }} />
      </Caption>
    </div>
  )
}

const slides: SlideDef[] = [
  { id: 'card-the-bug', title: 'Chapter 2 · The bug', chapter: CH, steps: 1, Component: () => <ChapterCard n={CH} /> },
  { id: 'boss-slow', title: 'Boss: the app is slow', chapter: CH, steps: 1, Component: () => <BossToast text="Users say the app is slow." /> },
  { id: 'where-is-it', title: 'Where is it slow? React, API, DB', chapter: CH, steps: 7, Component: WhereIsIt },
  { id: 'console-logs', title: 'John adds console.log everywhere', chapter: CH, steps: 6, Component: ConsoleLogs },
  { id: 'where-is-the-time', title: 'Where is the time going?', chapter: CH, steps: 2, Component: WhereIsTheTime },
]

export default slides
