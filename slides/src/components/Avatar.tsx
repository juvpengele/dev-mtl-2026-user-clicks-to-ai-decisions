import { motion } from 'motion/react'

/**
 * Original, flat, geometric characters: John Doe, his boss, and a neutral
 * speaker silhouette. Pure SVG, no images. `size` is the height in px.
 */
export type Who = 'john' | 'boss' | 'speaker'
export type Mood = 'neutral' | 'happy' | 'worried' | 'sad'

const P = {
  john: { skin: '#d9a27a', hair: '#2b2f38', top: '#5b8def', detail: '#3c64c4' },
  boss: { skin: '#b97f58', hair: '#a7afbd', top: '#2f3542', detail: '#a98bff' },
  speaker: { skin: '#8a93a3', hair: '#5d6574', top: '#5d6574', detail: '#8a93a3' },
}

const MOUTH: Record<Mood, string> = {
  neutral: 'M89,115 Q100,120 111,115',
  happy: 'M86,111 Q100,127 114,111',
  worried: 'M89,119 Q100,112 111,119',
  sad: 'M87,122 Q100,108 113,122',
}

const HAIR: Record<Who, string> = {
  john: 'M54,86 C52,50 76,34 102,35 C130,36 150,56 146,84 C138,68 122,60 104,62 C84,64 66,72 54,86 Z',
  boss: 'M55,96 C50,62 72,40 100,40 C128,40 150,62 145,96 C141,78 133,70 126,66 C112,60 88,60 74,66 C66,70 59,78 55,96 Z',
  speaker: 'M54,86 C52,52 76,38 100,38 C124,38 148,52 146,86 C138,70 122,62 100,62 C80,62 64,70 54,86 Z',
}

export function Avatar({
  who = 'john',
  size = 300,
  mood = 'neutral',
  x,
  y,
  back = false,
}: {
  who?: Who
  size?: number
  mood?: Mood
  /** Position when nested inside another SVG. */
  x?: number
  y?: number
  /** Seen from behind (audience member). */
  back?: boolean
}) {
  const c = P[who]
  const face = who !== 'speaker' && !back
  return (
    <svg viewBox="0 0 200 220" height={size} width={(size * 200) / 220} x={x} y={y} style={{ overflow: 'visible', display: 'block' }}>
      {/* Neck, shoulders, head */}
      <rect x={88} y={118} width={24} height={34} rx={8} fill={c.skin} />
      <path d="M28,220 C28,168 58,146 100,146 C142,146 172,168 172,220 Z" fill={c.top} />
      {who === 'john' && !back && <path d="M84,148 L100,170 L116,148" fill="none" stroke={c.detail} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
      {who === 'boss' && (
        <>
          <path d="M82,147 L100,172 L118,147 Z" fill="#e9ecf1" />
          <path d="M95,154 L105,154 L108,196 L100,206 L92,196 Z" fill={c.detail} />
        </>
      )}
      <circle cx={100} cy={88} r={47} fill={back ? c.hair : c.skin} />
      {!back && <path d={HAIR[who]} fill={c.hair} />}
      {face && (
        <>
          <circle cx={83} cy={95} r={4.6} fill="#1b1e25" />
          <circle cx={117} cy={95} r={4.6} fill="#1b1e25" />
          {who === 'john' && (
            <g fill="none" stroke="#1b1e25" strokeWidth={3}>
              <circle cx={83} cy={95} r={13} />
              <circle cx={117} cy={95} r={13} />
              <path d="M96,94 L104,94" />
            </g>
          )}
          <motion.g initial={false} animate={{ opacity: mood === 'worried' || mood === 'sad' ? 1 : 0 }} transition={{ duration: 0.25 }}>
            <path d="M72,76 L92,72" stroke="#1b1e25" strokeWidth={3.5} strokeLinecap="round" />
            <path d="M108,72 L128,76" stroke="#1b1e25" strokeWidth={3.5} strokeLinecap="round" />
          </motion.g>
          <motion.path
            initial={false}
            animate={{ d: MOUTH[mood] }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            fill="none"
            stroke="#1b1e25"
            strokeWidth={3.5}
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  )
}
