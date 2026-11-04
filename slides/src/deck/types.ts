import type { ComponentType } from 'react'

export interface SlideDef {
  /** Stable id. Also the heading used for this slide in src/notes.md. */
  id: string
  /** Short name shown in the overview and presenter view. */
  title: string
  /** Number of steps (clicks) on this slide. 1 = no in-slide animation steps. */
  steps: number
  /** 0-based chapter index into CHAPTERS (src/story.ts). Drives the journey bar. */
  chapter: number
  /** Hide the journey bar (only the cold open, which starts on pure black). */
  noJourney?: boolean
  Component: ComponentType
}

export interface DeckPosition {
  slide: number // 0-based
  step: number // 0-based
}
