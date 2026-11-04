import { useEffect, useRef } from 'react'
import { slides } from '../slides'
import { SlidePreview } from './SlideView'

export function Overview({ current, onPick }: { current: number; onPick: (i: number) => void }) {
  const currentRef = useRef<HTMLDivElement>(null)
  useEffect(() => currentRef.current?.scrollIntoView({ block: 'center' }), [])

  return (
    <div className="overview">
      <div className="overview-grid">
        {slides.map((s, i) => (
          <div key={s.id} ref={i === current ? currentRef : undefined} onClick={() => onPick(i)}>
            <div className={`thumb${i === current ? ' current' : ''}`} style={{ aspectRatio: '16 / 9' }}>
              <SlidePreview slide={s} step={s.steps - 1} />
              <span className="thumb-num">{i + 1}</span>
            </div>
            <div className="thumb-title">{s.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
