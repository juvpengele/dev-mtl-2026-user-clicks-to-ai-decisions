/** Small flat icons used in story slides. */

export function AtomIcon() {
  return (
    <svg viewBox="-32 -32 64 64" width={64} height={64} fill="none" stroke="var(--john)" strokeWidth={3.5}>
      {[0, 60, 120].map((r) => (
        <ellipse key={r} rx={28} ry={11} transform={`rotate(${r})`} />
      ))}
      <circle r={5} fill="var(--john)" stroke="none" />
    </svg>
  )
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 64 64" width={60} height={60} fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round">
      <circle cx={27} cy={27} r={17} />
      <path d="M40,40 L56,56" />
    </svg>
  )
}

export function SignalIcon() {
  return (
    <svg viewBox="0 0 64 64" width={64} height={64} fill="none" stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4,36 L16,36 L22,18 L32,50 L40,26 L46,36 L60,36" />
    </svg>
  )
}
