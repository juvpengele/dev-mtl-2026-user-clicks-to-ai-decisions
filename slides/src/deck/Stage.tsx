import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

export const STAGE_W = 1920
export const STAGE_H = 1080

/**
 * A fixed 1920×1080 stage, scaled to fit its parent and centered (letterboxed).
 * The parent decides the available space: the full window, a thumbnail, a presenter pane.
 */
export function Stage({ children, className }: { children: ReactNode; className?: string }) {
  const host = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ scale: 0, x: 0, y: 0 })

  useLayoutEffect(() => {
    const el = host.current
    if (!el) return
    const fit = () => {
      const { width, height } = el.getBoundingClientRect()
      const scale = Math.min(width / STAGE_W, height / STAGE_H)
      setBox({ scale, x: (width - STAGE_W * scale) / 2, y: (height - STAGE_H * scale) / 2 })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={host} className={className} style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
      <div
        className="stage"
        style={{
          transform: `translate(${box.x}px, ${box.y}px) scale(${box.scale})`,
          visibility: box.scale ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
