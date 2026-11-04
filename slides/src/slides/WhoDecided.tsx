import { Words } from '../components/Words'

/** "Who made the decision?" on pure black. Used to open the talk and again as the callback. */
export function WhoDecided({ at = 0, delay = 0 }: { at?: number; delay?: number }) {
  return (
    <div className="slide" style={{ background: '#000' }}>
      <Words text="Who made the decision?" className="title" at={at} delay={delay} stagger={0.32} spring="slow" />
    </div>
  )
}
