import { useCallback, useEffect, useRef, useState } from 'react'
import type { SlideDef } from './types'

export interface DeckState {
  slide: number
  step: number
  dir: 1 | -1
  black: boolean
}

type SyncMessage =
  | { type: 'state'; slide: number; step: number; black: boolean }
  | { type: 'hello' }

const CHANNEL = 'devmtl-deck-sync'

/** Hash format: #/<slide>/<step>, both 1-based so they match what the presenter view shows. */
function readHash(slides: SlideDef[]): { slide: number; step: number } {
  const m = window.location.hash.match(/^#\/(\d+)(?:\/(\d+))?/)
  if (!m) return { slide: 0, step: 0 }
  const slide = clamp(parseInt(m[1], 10) - 1, 0, slides.length - 1)
  const step = clamp(parseInt(m[2] ?? '1', 10) - 1, 0, slides[slide].steps - 1)
  return { slide, step }
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, Number.isFinite(n) ? n : lo))
}

export function useDeck(slides: SlideDef[]) {
  const [state, setState] = useState<DeckState>(() => ({ ...readHash(slides), dir: 1, black: false }))
  const channel = useRef<BroadcastChannel | null>(null)
  // Key of the last state received from the other window, so we don't echo it back.
  const lastRemote = useRef('')

  const next = useCallback(() => {
    setState((s) => {
      if (s.step < slides[s.slide].steps - 1) return { ...s, step: s.step + 1, dir: 1 }
      if (s.slide < slides.length - 1) return { ...s, slide: s.slide + 1, step: 0, dir: 1 }
      return s
    })
  }, [slides])

  const prev = useCallback(() => {
    setState((s) => {
      if (s.step > 0) return { ...s, step: s.step - 1, dir: -1 }
      if (s.slide > 0) return { ...s, slide: s.slide - 1, step: slides[s.slide - 1].steps - 1, dir: -1 }
      return s
    })
  }, [slides])

  const goTo = useCallback(
    (slide: number, step = 0) => {
      setState((s) => {
        const sl = clamp(slide, 0, slides.length - 1)
        const st = clamp(step, 0, slides[sl].steps - 1)
        return { ...s, slide: sl, step: st, dir: sl > s.slide || (sl === s.slide && st >= s.step) ? 1 : -1 }
      })
    },
    [slides],
  )

  const first = useCallback(() => goTo(0, 0), [goTo])
  const last = useCallback(() => goTo(slides.length - 1, slides[slides.length - 1].steps - 1), [goTo, slides])
  const toggleBlack = useCallback(() => setState((s) => ({ ...s, black: !s.black })), [])

  // URL hash: write on change (replaceState, so Back doesn't walk through every click) ...
  useEffect(() => {
    const hash = `#/${state.slide + 1}/${state.step + 1}`
    if (window.location.hash !== hash) history.replaceState(null, '', hash)
  }, [state.slide, state.step])

  // ... and follow manual edits of the hash.
  useEffect(() => {
    const onHash = () => {
      const h = readHash(slides)
      setState((s) => (s.slide === h.slide && s.step === h.step ? s : { ...s, ...h, dir: 1 }))
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [slides])

  // Cross-window sync (main window <-> presenter view).
  const stateRef = useRef(state)
  stateRef.current = state
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    const ch = new BroadcastChannel(CHANNEL)
    channel.current = ch
    ch.onmessage = (e: MessageEvent<SyncMessage>) => {
      const msg = e.data
      if (msg.type === 'hello') {
        const s = stateRef.current
        ch.postMessage({ type: 'state', slide: s.slide, step: s.step, black: s.black } satisfies SyncMessage)
        return
      }
      lastRemote.current = `${msg.slide}/${msg.step}/${msg.black}`
      setState((s) => {
        if (s.slide === msg.slide && s.step === msg.step && s.black === msg.black) return s
        const dir = msg.slide > s.slide || (msg.slide === s.slide && msg.step >= s.step) ? 1 : -1
        return { slide: msg.slide, step: msg.step, black: msg.black, dir }
      })
    }
    ch.postMessage({ type: 'hello' } satisfies SyncMessage)
    return () => {
      ch.close()
      channel.current = null
    }
  }, [])

  useEffect(() => {
    const key = `${state.slide}/${state.step}/${state.black}`
    if (key === lastRemote.current) return
    lastRemote.current = ''
    channel.current?.postMessage({
      type: 'state',
      slide: state.slide,
      step: state.step,
      black: state.black,
    } satisfies SyncMessage)
  }, [state.slide, state.step, state.black])

  return { ...state, next, prev, goTo, first, last, toggleBlack }
}

export type Deck = ReturnType<typeof useDeck>
