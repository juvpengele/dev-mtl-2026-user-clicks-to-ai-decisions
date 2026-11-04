import { useEffect, useRef } from 'react'

export interface KeyActions {
  next: () => void
  prev: () => void
  first: () => void
  last: () => void
  black: () => void
  fullscreen?: () => void
  overview?: () => void
  presenter?: () => void
  escape?: () => void
}

/**
 * Clicker-friendly key map. Most clickers send PageDown/PageUp (some send arrows),
 * and "." or "b" for the black-screen button.
 */
export function useKeyboard(actions: KeyActions) {
  const ref = useRef(actions)
  ref.current = actions

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      const a = ref.current
      let handled = true
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          a.next()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          a.prev()
          break
        case 'Home':
          a.first()
          break
        case 'End':
          a.last()
          break
        case 'b':
        case 'B':
        case '.':
          a.black()
          break
        case 'f':
        case 'F':
          if (a.fullscreen) a.fullscreen()
          else handled = false
          break
        case 'o':
        case 'O':
          if (a.overview) a.overview()
          else handled = false
          break
        case 'p':
        case 'P':
          if (a.presenter) a.presenter()
          else handled = false
          break
        case 'Escape':
          if (a.escape) a.escape()
          else handled = false
          break
        default:
          handled = false
      }
      if (handled) e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
