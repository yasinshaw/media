import { describe, it, expect } from 'vitest'
import { useFadeIn } from './useFadeIn'
import { useScaleIn } from './useScaleIn'
import { useSlideIn } from './useSlideIn'

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
