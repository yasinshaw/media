export interface SFXTriple {
  mood: string
  action: string
  intensity: string
  delay?: number
  volume?: number
}

export function matchSFX(
  mood: string,
  action: string,
  intensity: string,
  availableFiles: string[],
): string | null {
  const toFilename = (m: string, a: string, i: string) =>
    `${m}-${a}-${i}.mp3`

  const candidates = [
    toFilename(mood, action, intensity),
    toFilename(mood, action, 'medium'),
    toFilename('neutral', action, intensity),
    toFilename('neutral', action, 'medium'),
  ]

  return candidates.find((f) => availableFiles.includes(f)) ?? null
}

const LEGACY_MAP: Record<string, SFXTriple> = {
  'whoosh-in':  { mood: 'neutral', action: 'entry',      intensity: 'medium', delay: 0,   volume: 0.50 },
  'whoosh':     { mood: 'neutral', action: 'transition', intensity: 'medium', delay: 0,   volume: 0.50 },
  'swoosh':     { mood: 'energetic', action: 'transition', intensity: 'medium', delay: 0,   volume: 0.50 },
  'transition': { mood: 'neutral', action: 'transition', intensity: 'medium', delay: 0,   volume: 0.50 },
  'impact':     { mood: 'neutral', action: 'emphasis',   intensity: 'strong', delay: 0.3, volume: 0.40 },
  'text-pop':   { mood: 'playful', action: 'feedback',   intensity: 'medium', delay: 0.2, volume: 0.50 },
  'reveal':     { mood: 'playful', action: 'emphasis',   intensity: 'medium', delay: 0.2, volume: 0.50 },
  'ding':       { mood: 'playful', action: 'feedback',   intensity: 'subtle', delay: 0.1, volume: 0.50 },
  'click':      { mood: 'neutral', action: 'feedback',   intensity: 'subtle', delay: 0,   volume: 0.50 },
  'riser':      { mood: 'tense',   action: 'transition', intensity: 'medium', delay: 0,   volume: 0.45 },
  'glitch':     { mood: 'tense',   action: 'feedback',   intensity: 'medium', delay: 0,   volume: 0.35 },
  'success':    { mood: 'playful', action: 'feedback',   intensity: 'medium', delay: 0.1, volume: 0.50 },
  'outro':      { mood: 'epic',    action: 'exit',       intensity: 'medium', delay: 0,   volume: 0.55 },
}

export function translateLegacyType(type: string): SFXTriple | null {
  return LEGACY_MAP[type] ?? null
}

export function inferLayer(action: string): 'ambient' | 'action' | 'design' {
  if (action === 'ambient') return 'ambient'
  if (action === 'transition' || action === 'entry' || action === 'exit') return 'action'
  return 'design'
}
