import { describe, it, expect } from 'vitest'
import { useFadeIn } from './useFadeIn'
import { useScaleIn } from './useScaleIn'
import { useSlideIn } from './useSlideIn'
import { useFloat } from './useFloat'
import { usePulse } from './usePulse'
import { useRotate } from './useRotate'
import { useStagger } from './useStagger'
import { useNumberRoll } from './useNumberRoll'
import { useTextReveal } from './useTextReveal'

describe('useFadeIn', () => {
  it('returns opacity 0 before delay', () => {
    const result = useFadeIn.compute({ frame: 0, delay: 10, duration: 15 })
    expect(result.style.opacity).toBe(0)
  })

  it('returns opacity 1 after delay + duration', () => {
    const result = useFadeIn.compute({ frame: 30, delay: 10, duration: 15 })
    expect(result.style.opacity).toBe(1)
  })

  it('returns partial opacity during transition', () => {
    const result = useFadeIn.compute({ frame: 15, delay: 10, duration: 10 })
    expect(result.style.opacity).toBeGreaterThan(0)
    expect(result.style.opacity).toBeLessThan(1)
  })
})

describe('useScaleIn', () => {
  it('returns scale 0 at frame 0', () => {
    const result = useScaleIn.compute({ frame: 0, delay: 0 })
    expect(result.style.transform).toContain('scale(0')
  })

  it('returns scale ~1 at high frame', () => {
    const result = useScaleIn.compute({ frame: 60, delay: 0 })
    const match = result.style.transform?.match(/scale\(([\d.]+)\)/)
    expect(match).not.toBeNull()
    expect(parseFloat(match![1])).toBeCloseTo(1, 1)
  })

  it('includes opacity 0 at start', () => {
    const result = useScaleIn.compute({ frame: 0, delay: 0 })
    expect(result.style.opacity).toBe(0)
  })
})

describe('useSlideIn', () => {
  it('slides from left at frame 0', () => {
    const result = useSlideIn.compute({
      frame: 0,
      direction: 'left',
      delay: 0,
      distance: 60,
      duration: 15,
    })
    expect(result.style.transform).toContain('translateX(-60')
    expect(result.style.opacity).toBe(0)
  })

  it('settles at frame 30', () => {
    const result = useSlideIn.compute({
      frame: 30,
      direction: 'left',
      delay: 0,
      distance: 60,
      duration: 15,
    })
    expect(result.style.transform).toContain('translateX(0')
    expect(result.style.opacity).toBe(1)
  })

  it('slides from up correctly', () => {
    const result = useSlideIn.compute({
      frame: 0,
      direction: 'up',
      delay: 0,
      distance: 60,
      duration: 15,
    })
    expect(result.style.transform).toContain('translateY(-60')
  })
})

describe('useStagger', () => {
  it('returns correct number of styles', () => {
    const result = useStagger.compute({ frame: 0, count: 3, delayBetween: 8 })
    expect(result).toHaveLength(3)
  })

  it('first item is visible before later items', () => {
    const result = useStagger.compute({ frame: 10, count: 3, delayBetween: 8, duration: 10 })
    expect(Number(result[0].style.opacity)).toBeGreaterThan(Number(result[1].style.opacity))
  })

  it('all items visible at high frame', () => {
    const result = useStagger.compute({ frame: 100, count: 3, delayBetween: 8, duration: 10 })
    expect(result.every(s => s.style.opacity === 1)).toBe(true)
  })
})

describe('useNumberRoll', () => {
  it('returns 0 at frame 0', () => {
    const result = useNumberRoll.compute({ frame: 0, target: 100, duration: 60 })
    expect(result).toBe(0)
  })

  it('returns target at high frame', () => {
    const result = useNumberRoll.compute({ frame: 100, target: 100, duration: 60 })
    expect(result).toBe(100)
  })

  it('returns intermediate value during animation', () => {
    const result = useNumberRoll.compute({ frame: 30, target: 100, duration: 60 })
    expect(result).toBeGreaterThan(0)
    expect(result).toBeLessThan(100)
  })

  it('handles decimal targets', () => {
    const result = useNumberRoll.compute({ frame: 100, target: 0.14, duration: 60, decimals: 2 })
    expect(result).toBeCloseTo(0.14, 2)
  })
})

describe('useTextReveal', () => {
  it('returns 0 visible words at frame 0', () => {
    const result = useTextReveal.compute({ frame: 0, wordCount: 5, delayBetween: 6 })
    expect(result.visibleCount).toBe(0)
  })

  it('returns all words at high frame', () => {
    const result = useTextReveal.compute({ frame: 100, wordCount: 5, delayBetween: 6 })
    expect(result.visibleCount).toBe(5)
  })

  it('returns partial words during animation', () => {
    const result = useTextReveal.compute({ frame: 10, wordCount: 5, delayBetween: 6 })
    expect(result.visibleCount).toBeGreaterThan(0)
    expect(result.visibleCount).toBeLessThan(5)
  })
})
