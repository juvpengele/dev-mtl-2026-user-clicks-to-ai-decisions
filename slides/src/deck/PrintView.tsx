import { useEffect } from 'react'
import { talk } from '../config'
import { slides } from '../slides'
import { SlidePreview } from './SlideView'

/**
 * ?print: every slide at its final step, one 1920×1080 page each.
 * Ctrl/Cmd+P → "Save as PDF" (margins: none, background graphics: on), or `npm run pdf`.
 */
export function PrintView() {
  useEffect(() => {
    document.body.classList.add('print')
    document.title = talk.titleLine1 + ' (slides)'
    // Signal for the export script: fonts loaded, first layout done.
    document.fonts.ready.then(() => requestAnimationFrame(() => document.body.setAttribute('data-ready', '1')))
  }, [])
  return (
    <>
      <div className="print-bar">
        <button onClick={() => window.print()}>Print / Save as PDF</button>
      </div>
      {slides.map((s) => (
        <div key={s.id} className="print-page">
          <SlidePreview slide={s} step={s.steps - 1} />
        </div>
      ))}
    </>
  )
}
