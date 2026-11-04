import type { ReactNode } from 'react'

/**
 * Shared geometry for the N+1 trace (slides "n-plus-one" and "fixed"), so the
 * fixed version lines up exactly with the broken one.
 *
 * The request span sits on top; each query is a thin bar on its own row, so
 * 101 sequential queries draw a staircase down and across the stage.
 */
export const NP = {
  maxMs: 2000,
  left: 140,
  width: 1640,
  reqTop: 250,
  reqH: 52,
  qTop: 330,
  qStep: 6.4,
  qH: 5,
}

export const Q_DUR = 16
/** Query i starts after the previous one finishes (they run one by one). */
export const qStart = (i: number) => 12 + i * 19
export const qTop = (i: number) => NP.qTop + i * NP.qStep
export const px = (ms: number) => (ms / NP.maxMs) * NP.width
/** End of the request span once `n` queries have run. */
export const reqEnd = (n: number) => (n <= 0 ? 0 : qStart(n - 1) + Q_DUR + 12)

const TICKS: [number, string][] = [
  [0, '0'],
  [500, '0.5 s'],
  [1000, '1 s'],
  [1500, '1.5 s'],
  [2000, '2 s'],
]

/** Header, time axis and the request span. Children are the query bars. */
export function NPlusOneFrame({ endMs, children }: { endMs: number; children?: ReactNode }) {
  const gridBottom = qTop(101) + 10
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: NP.left, top: 104, display: 'flex', alignItems: 'baseline', gap: 28 }}>
        <span style={{ fontSize: 48, fontWeight: 750 }}>GET /events</span>
        <span className="label">trace</span>
      </div>
      {TICKS.map(([ms, text]) => (
        <div
          key={ms}
          style={{
            position: 'absolute',
            left: NP.left + px(ms),
            top: NP.reqTop - 56,
            height: gridBottom - NP.reqTop + 56,
            borderLeft: '2px solid var(--surface-2)',
          }}
        >
          <span className="mono" style={{ position: 'absolute', left: 10, top: 0, fontSize: 24, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            {text}
          </span>
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: NP.left,
          top: NP.reqTop,
          width: px(endMs),
          height: NP.reqH,
          borderRadius: 10,
          background: 'var(--trace)',
          boxShadow: '0 0 24px var(--trace-glow)',
        }}
      />
      {children}
    </div>
  )
}

/** The big query / duration readout in the empty top-right corner. */
export function QueryCounter({ queries, ms, note, color }: { queries: number; ms: number; note: string; color: string }) {
  return (
    <div style={{ position: 'absolute', right: 140, top: 310, textAlign: 'right' }}>
      <div className="huge mono" style={{ color, fontVariantNumeric: 'tabular-nums' }}>
        {queries}
      </div>
      <div className="body" style={{ marginTop: 8 }}>
        {queries === 1 ? 'query' : 'queries'} ·{' '}
        <span className="mono" style={{ color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
          {ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`}
        </span>
      </div>
      <div className="label" style={{ marginTop: 12 }}>
        {note}
      </div>
    </div>
  )
}
