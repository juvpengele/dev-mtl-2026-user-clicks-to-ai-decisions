import { Words } from '../components/Words'

/** "Who made the decision?" on pure black. Used to open the talk and again as the callback. */
export function WhoDecided({ at = 0, delay = 0 }: Readonly<{ at?: number; delay?: number }>) {
  return (
    <div className="slide" style={{ background: '#000' }}>
      <Words text="Who made the decision?" className="title" at={at} delay={delay} stagger={0.32} spring="slow" />
    </div>
  )
}

/** One line per click after the question; the last one is the lead-in to the loop. */
export const CALLBACK_LINES = ['Maybe the developer.', 'Maybe the AI agent.', 'Maybe both.', 'But whoever made it…']

/** The callback: same question, then the possible answers, one click at a time. */
export function WhoDecidedCallback({ delay = 0 }: Readonly<{ delay?: number }>) {
  const last = CALLBACK_LINES.length - 1
  return (
    <div className="slide" style={{ background: '#000' }}>
      <Words text="So, who made the decision?" className="title" delay={delay} stagger={0.32} spring="slow" />
      <div style={{ marginTop: 72, textAlign: 'center' }}>
        {CALLBACK_LINES.map((line, i) => (
          <Words
            key={line}
            text={line}
            at={i + 1}
            stagger={0.12}
            className="body"
            style={{ fontSize: 56, marginTop: i === last ? 56 : 20, color: i === last ? '#f6f7f9' : undefined, fontWeight: i === last ? 750 : undefined }}
          />
        ))}
      </div>
    </div>
  )
}
