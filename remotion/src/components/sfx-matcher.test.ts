import { describe, it, expect } from 'vitest'
import { matchSFX, translateLegacyType } from './sfx-matcher'

describe('matchSFX', () => {
  const originalFiles = [
    'neutral-emphasis-medium.mp3',
    'neutral-transition-medium.mp3',
    'energetic-emphasis-strong.mp3',
    'neutral-emphasis-strong.mp3',
    'epic-transition-strong.mp3',
  ]

  it('returns exact match', () => {
    expect(matchSFX('energetic', 'emphasis', 'strong', originalFiles))
      .toBe('energetic-emphasis-strong.mp3')
  })

  it('falls back to mood+action with medium intensity', () => {
    const filesWithMoodAction = [...originalFiles, 'energetic-emphasis-medium.mp3']
    expect(matchSFX('energetic', 'emphasis', 'subtle', filesWithMoodAction))
      .toBe('energetic-emphasis-medium.mp3')
  })

  it('falls back to neutral+action+intensity', () => {
    expect(matchSFX('calm', 'emphasis', 'strong', originalFiles))
      .toBe('neutral-emphasis-strong.mp3')
  })

  it('falls back to neutral+action+medium', () => {
    expect(matchSFX('calm', 'transition', 'strong', originalFiles))
      .toBe('neutral-transition-medium.mp3')
  })

  it('returns null when no match found', () => {
    expect(matchSFX('calm', 'exit', 'subtle', originalFiles))
      .toBeNull()
  })
})

describe('translateLegacyType', () => {
  it('translates impact to taxonomy triple', () => {
    const result = translateLegacyType('impact')
    expect(result).toEqual({
      mood: 'neutral', action: 'emphasis', intensity: 'strong', delay: 0.3, volume: 0.40,
    })
  })

  it('translates whoosh-in to taxonomy triple', () => {
    const result = translateLegacyType('whoosh-in')
    expect(result).toEqual({
      mood: 'neutral', action: 'entry', intensity: 'medium', delay: 0, volume: 0.50,
    })
  })

  it('returns null for unknown type', () => {
    expect(translateLegacyType('nonexistent')).toBeNull()
  })
})
