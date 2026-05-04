import type { CSSProperties } from 'react'

interface TextRevealParams {
  frame: number
  wordCount: number
  delayBetween?: number
}

interface TextRevealResult {
  visibleCount: number
  getStyle: (index: number) => { style: CSSProperties }
}

const computeTextReveal = (params: TextRevealParams): TextRevealResult => {
  const { frame, wordCount, delayBetween = 6 } = params

  const visibleCount = Math.min(wordCount, Math.floor(frame / delayBetween))

  const getStyle = (index: number): { style: CSSProperties } => ({
    style: {
      opacity: index < visibleCount ? 1 : 0,
    },
  })

  return { visibleCount, getStyle }
}

function useTextReveal(
  frame: number,
  wordCount: number,
  delayBetween?: number,
): TextRevealResult {
  return computeTextReveal({ frame, wordCount, delayBetween })
}

useTextReveal.compute = computeTextReveal

export { useTextReveal }
