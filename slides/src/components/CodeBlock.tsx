import { createHighlighterCoreSync } from '@shikijs/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import typescript from '@shikijs/langs/typescript'
import theme from '@shikijs/themes/github-dark-high-contrast'
import { motion } from 'motion/react'
import { useMemo, type ReactNode } from 'react'
import { useSlide } from '../deck/SlideContext'
import { useCountTo } from './useCountTo'

// Bundled, synchronous, no WASM, no network: works offline and never flashes unhighlighted code.
const highlighter = createHighlighterCoreSync({
  themes: [theme],
  langs: [typescript],
  engine: createJavaScriptRegexEngine(),
})

export interface CodeStep {
  /** 1-based line numbers to focus. Empty = everything at full strength. */
  lines: number[]
  /** Lines that pulse (e.g. the query inside the loop). */
  pulse?: number[]
}

export function CodeBlock({
  code,
  filename,
  steps,
  fontSize = 36,
  typeOn,
  badge,
}: {
  code: string
  filename: string
  /** One entry per slide step. */
  steps: CodeStep[]
  fontSize?: number
  /** The code writes itself on entry, at `cps` characters per second. */
  typeOn?: { cps: number; delay?: number }
  /** Small tag on the right of the title bar. */
  badge?: ReactNode
}) {
  const { step, initial, t, isStatic, reduced } = useSlide()
  const lines = useMemo(
    () => highlighter.codeToTokensBase(code.replace(/\n$/, ''), { lang: 'typescript', theme: theme.name! }),
    [code],
  )
  const current = steps[Math.min(step, steps.length - 1)] ?? { lines: [] }
  const focused = new Set(current.lines)
  const pulsing = new Set(current.pulse ?? [])
  const lineH = fontSize * 1.5
  const total = useMemo(() => lines.reduce((n, l) => n + l.reduce((m, tok) => m + tok.content.length, 0) + 1, 0), [lines])
  const typed = Math.round(
    useCountTo(total, { from: typeOn ? 0 : total, duration: typeOn ? total / typeOn.cps : 0, delay: typeOn?.delay ?? 0 }),
  )
  const typing = typeOn && typed < total
  let budget = typed
  let caretPlaced = false

  return (
    <motion.div
      initial={initial === false ? false : { opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={t.spring('soft')}
      style={{
        background: '#0d1117',
        border: '2px solid var(--surface-2)',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '18px 28px',
          borderBottom: '2px solid var(--surface-2)',
          background: 'var(--surface)',
        }}
      >
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c, opacity: 0.8 }} />
        ))}
        <span className="mono" style={{ marginLeft: 16, fontSize: 26, color: 'var(--ink-2)' }}>
          {filename}
        </span>
        {badge && <span style={{ marginLeft: 'auto' }}>{badge}</span>}
      </div>
      <pre
        className="mono"
        style={{ margin: 0, padding: '24px 0', fontSize, lineHeight: `${lineH}px`, fontVariantLigatures: 'none' }}
      >
        {lines.map((tokens, i) => {
          const n = i + 1
          const isFocus = focused.size === 0 || focused.has(n)
          const isPulse = pulsing.has(n)
          const lineBudget = budget
          budget = Math.max(0, budget - tokens.reduce((m, tok) => m + tok.content.length, 0) - 1)
          let left = lineBudget
          return (
            <motion.div
              key={i}
              style={{ position: 'relative', padding: '0 48px 0 72px', minHeight: lineH }}
              animate={{
                opacity: isFocus ? 1 : 0.22,
                backgroundColor: focused.size > 0 && isFocus ? 'rgba(255,178,36,0.10)' : 'rgba(255,178,36,0)',
              }}
              transition={t.spring('snappy', isFocus ? i * 0.015 : 0)}
            >
              <motion.span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 10,
                  background: isPulse ? 'var(--bad)' : 'var(--trace)',
                  originY: 0,
                }}
                animate={{ scaleY: focused.size > 0 && isFocus ? 1 : 0 }}
                transition={t.spring('snappy', i * 0.015)}
              />
              {isPulse && !isStatic && !reduced && (
                <motion.span
                  style={{ position: 'absolute', inset: 0, background: 'var(--bad)', pointerEvents: 'none' }}
                  animate={{ opacity: [0, 0.28, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <span style={{ position: 'relative' }}>
                {tokens.length === 0
                  ? ' '
                  : tokens.map((tok, j) => {
                      // While typing, only the first `typed` characters are visible; the rest keep their space.
                      const shown = Math.max(0, Math.min(tok.content.length, left))
                      left -= shown
                      const caretHere = !!typing && !caretPlaced && shown < tok.content.length
                      if (caretHere) caretPlaced = true
                      return (
                        <span key={j} style={{ color: tok.color }}>
                          {tok.content.slice(0, shown)}
                          {caretHere && <span className="caret" style={{ background: 'var(--ink)' }} />}
                          {shown < tok.content.length && <span style={{ visibility: 'hidden' }}>{tok.content.slice(shown)}</span>}
                        </span>
                      )
                    })}
              </span>
            </motion.div>
          )
        })}
      </pre>
    </motion.div>
  )
}
