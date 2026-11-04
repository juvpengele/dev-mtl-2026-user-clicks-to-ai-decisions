import raw from './notes.md?raw'

/**
 * Parses src/notes.md: each "## <slide-id>" heading starts that slide's notes.
 * Anything before the first heading is ignored (use it for your own comments).
 */
const notes = new Map<string, string>()
for (const chunk of raw.split(/^## +/m).slice(1)) {
  const nl = chunk.indexOf('\n')
  const id = (nl === -1 ? chunk : chunk.slice(0, nl)).trim().split(/\s+/)[0]
  notes.set(id, nl === -1 ? '' : chunk.slice(nl + 1).trim())
}

export function notesFor(id: string): string {
  return notes.get(id) ?? ''
}
