import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { CenteredStack } from '../../../components'

interface ShotProps {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

const FolderStructure: React.FC<{ highlightProgress: number }> = ({ highlightProgress }) => (
  <div
    style={{
      background: '#1e293b',
      borderRadius: 20,
      padding: '32px 40px',
      fontFamily: 'monospace',
      fontSize: 32,
      lineHeight: 2,
      border: '2px solid #334155',
      minWidth: 500,
    }}
  >
    <div style={{ color: '#64748b' }}>📁 my-skill/</div>
    <div
      style={{
        color: highlightProgress > 0 ? '#fbbf24' : '#94a3b8',
        fontWeight: highlightProgress > 0 ? 800 : 400,
        padding: '4px 12px',
        background: highlightProgress > 0 ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
        borderRadius: 8,
        display: 'inline-block',
        marginLeft: 32,
      }}
    >
      📄 SKILL.md
    </div>
    <div style={{ color: '#64748b', marginLeft: 32 }}>📄 ...</div>
  </div>
)

const BrainIcon: React.FC<{ glowProgress: number }> = ({ glowProgress }) => (
  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ fontSize: 100 }}>🧠</div>
    <div
      style={{
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
        transform: `scale(${glowProgress})`,
        opacity: glowProgress * 0.8,
      }}
    />
  </div>
)

export const Shot3: React.FC<ShotProps> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const folderFade = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const highlightProgress = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' })

  const tagOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' })
  const tagSpring = spring({ frame: frame - 30, fps, config: { damping: 15, stiffness: 100 } })

  const arrowProgress = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' })
  const brainGlow = interpolate(frame, [80, 110], [0, 1], { extrapolateRight: 'clamp' })

  const captionOpacity = interpolate(frame, [100, 120], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <CenteredStack
      background="linear-gradient(135deg, #0f172a, #1e293b)"
      gap={36}
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <div style={{ opacity: folderFade }}>
        <FolderStructure highlightProgress={highlightProgress} />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 16,
          opacity: tagOpacity,
          transform: `scale(${tagSpring})`,
        }}
      >
        <span
          style={{
            padding: '8px 24px',
            background: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid #6366f1',
            borderRadius: 20,
            fontSize: 28,
            color: '#a5b4fc',
            fontWeight: 700,
          }}
        >
          YAML
        </span>
        <span
          style={{
            padding: '8px 24px',
            background: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid #6366f1',
            borderRadius: 20,
            fontSize: 28,
            color: '#a5b4fc',
            fontWeight: 700,
          }}
        >
          Markdown
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <div
          style={{
            fontSize: 56,
            opacity: folderFade,
            transform: `translateX(${interpolate(arrowProgress, [0, 1], [0, 60])}px)`,
          }}
        >
          📄
        </div>
        <div
          style={{
            fontSize: 48,
            color: '#6366f1',
            opacity: arrowProgress,
            transform: `translateX(${interpolate(arrowProgress, [0, 1], [-40, 0])}px)`,
          }}
        >
          →
        </div>
        <div
          style={{
            opacity: arrowProgress,
            transform: `translateX(${interpolate(arrowProgress, [0, 1], [-60, 0])}px)`,
          }}
        >
          <BrainIcon glowProgress={brainGlow} />
        </div>
      </div>

      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: '#fbbf24',
          textAlign: 'center',
          opacity: captionOpacity,
          padding: '12px 32px',
          background: 'rgba(251, 191, 36, 0.1)',
          borderRadius: 16,
        }}
      >
        一个 Markdown 文件 = AI 的新技能
      </div>
    </CenteredStack>
  )
}
