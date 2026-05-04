import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'
import { theme, FONT_FAMILY, backgrounds } from '../theme'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
}

const codeLines = [
  { text: 'function calculate(items) {', err: false },
  { text: '  let total = 0', err: false },
  { text: '  for (let i = 0; i < items.lenght; i++) {', err: true },
  { text: '    total += items[i].price', err: false },
  { text: '  }', err: false },
  { text: '  return total.toFixxed(2)', err: true },
  { text: '}', err: false },
] as const

export const Shot5: React.FC<ShotProps> = ({ subtitleSegments }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const subtitle = subtitleSegments?.find((s) => frame / fps >= s.start && frame / fps < s.end)?.text

  // Code editor reveals first
  const codeOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' })
  const codeY = interpolate(frame, [0, 18], [40, 0], { extrapolateRight: 'clamp' })

  // 暴跌40% with shake
  const numProgress = spring({ frame, fps, config: { damping: 9, stiffness: 200 }, delay: 110 })
  const numScale = interpolate(numProgress, [0, 1], [0.4, 1])
  const numOpacity = interpolate(numProgress, [0, 0.4], [0, 1])
  const shakeIntensity = interpolate(frame, [120, 170], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const shakeX = Math.sin(frame * 1.5) * shakeIntensity

  // Highlight wipe
  const highlightProgress = spring({ frame, fps, config: { damping: 200 }, delay: 140 })

  // Caption fade
  const captionOpacity = interpolate(frame, [220, 250], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack background={backgrounds[4]} maxWidth={1000} gap={36} subtitle={subtitle}>
      {/* Code editor */}
      <div style={{
        opacity: codeOpacity,
        transform: `translateY(${codeY}px)`,
        width: '100%',
        background: '#0F1923',
        border: `2px solid ${theme.cardBorderDark}`,
        borderRadius: 16,
        padding: 24,
        fontFamily: 'Menlo, Monaco, monospace',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}>
        {/* Editor header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          paddingBottom: 14,
          borderBottom: `1px solid ${theme.cardBorderDark}`,
          marginBottom: 14,
        }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#FF5F56' }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#FFBD2E' }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#27C93F' }} />
          <div style={{
            marginLeft: 12,
            fontSize: 20,
            color: theme.textSecondaryOnDark,
            fontFamily: 'Menlo, Monaco, monospace',
          }}>
            ai-output.js
          </div>
        </div>
        {/* Code lines */}
        {codeLines.map((line, i) => {
          const lineDelay = 18 + i * 5
          const lineOpacity = interpolate(frame, [lineDelay, lineDelay + 10], [0, 1], { extrapolateRight: 'clamp' })
          return (
            <div key={i} style={{
              opacity: lineOpacity,
              fontSize: 24,
              color: line.err ? theme.dangerSoft : theme.textOnDark,
              padding: '4px 0',
              fontFamily: 'Menlo, Monaco, monospace',
              borderBottom: line.err ? `2px wavy ${theme.danger}` : 'none',
              textDecoration: line.err ? 'underline' : 'none',
              textDecorationColor: theme.danger,
              textDecorationStyle: 'wavy',
              textDecorationThickness: '2px',
            }}>
              <span style={{ color: theme.textSecondaryOnDark, marginRight: 16, userSelect: 'none' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {line.text}
            </div>
          )
        })}
      </div>

      {/* 暴跌40% — center stage */}
      <div style={{
        opacity: numOpacity,
        transform: `scale(${numScale}) translateX(${shakeX}px)`,
        display: 'flex',
        alignItems: 'baseline',
        gap: 16,
        fontFamily: FONT_FAMILY,
      }}>
        <div style={{
          fontSize: 56,
          fontWeight: 800,
          color: theme.textOnDark,
        }}>
          推理能力
        </div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <span style={{
            position: 'absolute',
            left: -6, right: -6, top: '50%', height: '1.1em',
            transform: `translateY(-50%) scaleX(${highlightProgress})`,
            transformOrigin: 'left center',
            backgroundColor: theme.danger,
            opacity: 0.35,
            borderRadius: '0.12em',
          }} />
          <span style={{
            position: 'relative', zIndex: 1,
            fontSize: 110, fontWeight: 900,
            color: theme.danger,
            letterSpacing: '-2px',
          }}>
            暴跌 40%
          </span>
          <span style={{
            position: 'relative', zIndex: 1,
            fontSize: 80,
            color: theme.danger,
            marginLeft: 8,
          }}>
            ↓
          </span>
        </div>
      </div>

      {/* Caption */}
      <div style={{
        opacity: captionOpacity,
        fontSize: 30,
        fontWeight: 600,
        color: theme.textSecondaryOnDark,
        fontFamily: FONT_FAMILY,
      }}>
        你付的，是顶级模型的钱
      </div>
    </CenteredStack>
  )
}
