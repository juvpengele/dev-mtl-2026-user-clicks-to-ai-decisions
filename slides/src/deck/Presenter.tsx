import { useEffect, useState } from 'react'
import { talk } from '../config'
import { notesFor } from '../notes'
import { slides } from '../slides'
import { CHAPTERS } from '../story'
import { SlidePreview } from './SlideView'
import { useDeck } from './useDeck'
import { useKeyboard } from './useKeyboard'

export function Presenter() {
  const deck = useDeck(slides)
  const timer = useTimer()

  useEffect(() => {
    document.body.classList.add('presenter')
    document.title = 'Presenter: ' + talk.titleLine1
  }, [])

  useKeyboard({
    next: deck.next,
    prev: deck.prev,
    first: deck.first,
    last: deck.last,
    black: deck.toggleBlack,
  })

  const slide = slides[deck.slide]
  const hasNextStep = deck.step < slide.steps - 1
  const nextSlide = slides[deck.slide + 1]
  const totalSteps = slides.reduce((n, s) => n + s.steps, 0)
  const doneSteps = slides.slice(0, deck.slide).reduce((n, s) => n + s.steps, 0) + deck.step + 1

  const minutes = timer.elapsed / 60000
  const timeColor = minutes > talk.durationMinutes ? 'var(--bad)' : minutes > talk.durationMinutes - 5 ? 'var(--trace)' : 'var(--ink)'

  return (
    <div className="presenter-root">
      <header className="pv-header">
        <div className="pv-counter">
          <b>
            {deck.slide + 1}
            <span>/{slides.length}</span>
          </b>
          <span className="pv-step">
            step {deck.step + 1}/{slide.steps}
          </span>
          <span className="pv-step">
            Ch {slide.chapter + 1} · {CHAPTERS[slide.chapter]}
          </span>
          {deck.black && <span className="pv-black">BLACK</span>}
        </div>
        <div className="pv-timer" style={{ color: timeColor }}>
          {fmt(timer.elapsed)}
          <button onClick={timer.toggle}>{timer.running ? 'Pause' : 'Start'}</button>
          <button onClick={timer.reset}>Reset</button>
        </div>
        <div className="pv-clock">{new Date(timer.now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </header>
      <div className="pv-progress">
        <div style={{ width: `${(doneSteps / totalSteps) * 100}%` }} />
      </div>

      <main className="pv-main">
        <section className="pv-current">
          <div className="pv-label">Now · {slide.title}</div>
          <div className="pv-frame">
            <SlidePreview slide={slide} step={deck.step} />
          </div>
        </section>
        <section className="pv-side">
          <div className="pv-label">
            {hasNextStep ? `Next step (${deck.step + 2}/${slide.steps})` : nextSlide ? `Next slide · ${nextSlide.title}` : 'End of deck'}
          </div>
          <div className="pv-frame small">
            {hasNextStep ? (
              <SlidePreview slide={slide} step={deck.step + 1} />
            ) : nextSlide ? (
              <SlidePreview slide={nextSlide} step={nextSlide.steps - 1} />
            ) : null}
          </div>
          <div className="pv-label">Notes</div>
          <div className="pv-notes">{notesFor(slide.id) || <em>No notes for “{slide.id}”.</em>}</div>
        </section>
      </main>
      <footer className="pv-footer">
        → / Space / PageDown next · ← / PageUp back · B black · Home / End
      </footer>
    </div>
  )
}

function fmt(ms: number) {
  const s = Math.floor(ms / 1000)
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

function useTimer() {
  const [now, setNow] = useState(Date.now())
  const [startedAt, setStartedAt] = useState<number | null>(Date.now())
  const [banked, setBanked] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [])

  const elapsed = banked + (startedAt ? now - startedAt : 0)
  return {
    now,
    elapsed,
    running: startedAt !== null,
    toggle: () => {
      if (startedAt) {
        setBanked(banked + Date.now() - startedAt)
        setStartedAt(null)
      } else setStartedAt(Date.now())
    },
    reset: () => {
      setBanked(0)
      setStartedAt(startedAt ? Date.now() : null)
    },
  }
}
