import { motion } from 'motion/react'
import { DemoCue } from '../components/DemoCue'
import { Arrow, NodeBox, Svg } from '../components/Diagram'
import { BossSays, ChapterCard, JohnThinks } from '../components/Story'
import { useSlide } from '../deck/SlideContext'
import type { SlideDef } from '../deck/types'

const CH = 5

/** Step 0: App → Collector → Jaeger. Step 1: the Azure branch. Step 2: "App code changes: 0". */
function Collector() {
  const { step, initial, t } = useSlide()
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div className="label" style={{ position: 'absolute', left: 140, top: 110 }}>
        Local <span style={{ color: 'var(--ink)' }}>→</span> Cloud
      </div>
      <Svg>
        <NodeBox cx={270} cy={500} w={340} label="App" sub="project-x" />
        <Arrow from={[460, 500]} to={[570, 500]} delay={0.2} color="var(--trace)" />
        <text x={515} y={460} textAnchor="middle" fontSize={26} fontFamily="var(--font-mono)" fill="var(--muted)">
          OTLP
        </text>
        <NodeBox cx={820} cy={500} w={460} label="Collector" sub="OpenTelemetry" delay={0.3} />
        <Arrow from={[1070, 475]} to={[1280, 320]} delay={0.6} color="var(--trace)" />
        <NodeBox cx={1560} cy={290} w={520} label="Jaeger" sub="local" delay={0.7} />
        <Arrow from={[1070, 525]} to={[1280, 680]} at={1} color="var(--trace)" />
        <NodeBox cx={1560} cy={710} w={520} label="Application Insights" sub="Azure · cloud" at={1} delay={0.3} />
      </Svg>
      <motion.div
        initial={initial}
        animate={step >= 2 ? 'shown' : 'hidden'}
        variants={{ hidden: { opacity: 0, scale: 0.6 }, shown: { opacity: 1, scale: 1 } }}
        transition={t.spring('bouncy')}
        style={{ position: 'absolute', left: 140, top: 700, width: 900 }}
      >
        <div className="mono" style={{ fontSize: 60, color: 'var(--ink-2)' }}>
          App code changes: <span style={{ color: 'var(--ok)', fontWeight: 800, fontSize: 96 }}>0</span>
        </div>
        <div className="mono" style={{ fontSize: 30, color: 'var(--muted)', marginTop: 16 }}>
          changed: collector.yaml (one exporter)
        </div>
      </motion.div>
    </div>
  )
}

const slides: SlideDef[] = [
  { id: 'card-cloud', title: 'Chapter 6 · Cloud', chapter: CH, steps: 1, Component: () => <ChapterCard n={CH} /> },
  { id: 'boss-cloud', title: "Boss: we're moving to the cloud", chapter: CH, steps: 1, Component: () => <BossSays text="We're moving to the cloud." /> },
  { id: 'john-worry', title: 'Without breaking my workflow?', chapter: CH, steps: 1, Component: () => <JohnThinks text="Without breaking my workflow?" /> },
  { id: 'collector', title: 'Collector: local + Azure', chapter: CH, steps: 3, Component: Collector },
  { id: 'demo-cloud', title: 'Demo: same trace, in the cloud', chapter: CH, steps: 1, Component: () => <DemoCue title="same trace, in the cloud" /> },
]

export default slides
