import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { JourneyBar } from '../components/JourneyBar'
import { slides } from '../slides'
import { Overview } from './Overview'
import { SlideProvider } from './SlideContext'
import { Stage } from './Stage'
import { useDeck } from './useDeck'
import { useKeyboard } from './useKeyboard'
import { useReducedMotionPref } from './useReducedMotionPref'

export function Deck() {
  const deck = useDeck(slides)
  const reduced = useReducedMotionPref()
  const [overview, setOverview] = useState(false)
  const idle = useIdleCursor()

  useKeyboard({
    next: deck.next,
    prev: deck.prev,
    first: deck.first,
    last: deck.last,
    black: deck.toggleBlack,
    fullscreen: () => {
      if (document.fullscreenElement) document.exitFullscreen()
      else document.documentElement.requestFullscreen().catch(() => {})
    },
    overview: () => setOverview((o) => !o),
    escape: () => setOverview(false),
    presenter: () => {
      const url = `${location.pathname}?presenter${location.hash}`
      window.open(url, 'devmtl-presenter', 'width=1440,height=900')
    },
  })

  const slide = slides[deck.slide]
  const { Component } = slide

  return (
    <MotionConfig reducedMotion="user">
      <div className="viewport" style={{ cursor: idle ? 'none' : 'default' }}>
        <Stage>
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={slide.id}
              style={{ position: 'absolute', inset: 0 }}
              initial={{ opacity: 0, y: deck.dir * 14 }}
              animate={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 30 } }}
              exit={{ opacity: 0, y: deck.dir * -10, transition: { duration: 0.14, ease: 'easeIn' } }}
            >
              <SlideProvider step={deck.step} dir={deck.dir} enteredBackward={deck.dir < 0} isStatic={false} reduced={reduced}>
                <Component />
              </SlideProvider>
            </motion.div>
          </AnimatePresence>
          {!slide.noJourney && <JourneyBar chapter={slide.chapter} animate={!reduced} />}
          <AnimatePresence>
            {deck.black && (
              <motion.div
                className="blackout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            )}
          </AnimatePresence>
        </Stage>
      </div>
      {overview && (
        <Overview
          current={deck.slide}
          onPick={(i) => {
            deck.goTo(i, 0)
            setOverview(false)
          }}
        />
      )}
    </MotionConfig>
  )
}

/** Hide the mouse cursor after 2s of no movement, so it never sits on top of a slide. */
function useIdleCursor() {
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    let timer = 0
    const wake = () => {
      setIdle(false)
      clearTimeout(timer)
      timer = window.setTimeout(() => setIdle(true), 2000)
    }
    wake()
    window.addEventListener('mousemove', wake)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', wake)
    }
  }, [])
  return idle
}
