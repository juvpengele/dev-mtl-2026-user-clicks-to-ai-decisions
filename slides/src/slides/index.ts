import type { SlideDef } from '../deck/types'
import ch1 from './ch1-project-x'
import ch2 from './ch2-the-bug'
import ch3 from './ch3-the-talk'
import ch4 from './ch4-nextjs'
import ch5 from './ch5-telemetry'
import ch6 from './ch6-cloud'
import ch7 from './ch7-cloud-agent'
import ch8 from './ch8-local-agent'
import ch9 from './ch9-decision'

/** John's journey, chapter by chapter. Each chapter file owns its slides and their order. */
export const slides: SlideDef[] = [...ch1, ...ch2, ...ch3, ...ch4, ...ch5, ...ch6, ...ch7, ...ch8, ...ch9]

if (import.meta.env.DEV) {
  const ids = new Set<string>()
  for (const s of slides) {
    if (ids.has(s.id)) console.error(`Duplicate slide id: ${s.id}`)
    ids.add(s.id)
  }
}
