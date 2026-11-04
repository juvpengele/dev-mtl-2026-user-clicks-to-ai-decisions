import { MotionConfig } from 'motion/react'
import { JourneyBar } from '../components/JourneyBar'
import { SlideProvider } from './SlideContext'
import { Stage } from './Stage'
import type { SlideDef } from './types'
import { useReducedMotionPref } from './useReducedMotionPref'

/** Static, non-animated render of a slide at a given step. Used by the overview and presenter. */
export function SlidePreview({ slide, step }: { slide: SlideDef; step: number }) {
  const reduced = useReducedMotionPref()
  const { Component } = slide
  return (
    <Stage>
      <MotionConfig transition={{ duration: 0 }}>
        <SlideProvider key={`${slide.id}`} step={step} dir={1} enteredBackward isStatic reduced={reduced}>
          <Component />
        </SlideProvider>
        {!slide.noJourney && <JourneyBar chapter={slide.chapter} animate={false} />}
      </MotionConfig>
    </Stage>
  )
}
