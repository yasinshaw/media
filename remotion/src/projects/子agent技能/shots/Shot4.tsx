import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import React from 'react'
import { ProgressiveSubtitle } from '../../../components/ProgressiveSubtitle'

interface Shot4Props {
  subtitleSegments?: Array<{ text: string; start: number; end: number; duration: number }>
  videoOffset?: number
}

export const Shot4: React.FC<Shot4Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const editorOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  })

  const line1Opacity = interpolate(frame, [15, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const line2Opacity = interpolate(frame, [25, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const line3Opacity = interpolate(frame, [35, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const line4Opacity = interpolate(frame, [50, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 40px 200px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '900px' }}>
        {/* File path bar */}
        <div
          style={{
            opacity: editorOpacity,
            background: '#1e293b',
            borderRadius: '16px 16px 0 0',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderWidth: 1,
            borderColor: '#334155',
            borderStyle: 'solid',
            borderBottom: 'none',
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
          </div>
          <div style={{ fontSize: 22, color: '#94a3b8', fontWeight: 600 }}>
            .claude/agents/code-reviewer.md
          </div>
        </div>

        {/* Code content */}
        <div
          style={{
            opacity: editorOpacity,
            background: '#0f172a',
            borderRadius: '0 0 16px 16px',
            padding: '32px',
            borderWidth: 1,
            borderColor: '#334155',
            borderStyle: 'solid',
            borderTop: 'none',
            fontFamily: 'monospace',
            fontSize: 26,
            lineHeight: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* name field */}
          <div style={{ opacity: line1Opacity }}>
            <span style={{ color: '#f59e0b' }}>---</span>
          </div>
          <div style={{ opacity: line1Opacity }}>
            <span style={{ color: '#94a3b8' }}>name</span>
            <span style={{ color: '#64748b' }}>: </span>
            <span style={{ color: '#22c55e' }}>{'"'}code-reviewer{'"'}</span>
          </div>

          {/* description field */}
          <div style={{ opacity: line2Opacity }}>
            <span style={{ color: '#94a3b8' }}>description</span>
            <span style={{ color: '#64748b' }}>: </span>
            <span style={{ color: '#22c55e' }}>{'"'}代码审查专家{'"'}</span>
          </div>

          {/* tools field */}
          <div style={{ opacity: line3Opacity }}>
            <span style={{ color: '#94a3b8' }}>tools</span>
            <span style={{ color: '#64748b' }}>:</span>
          </div>
          <div style={{ opacity: line3Opacity, paddingLeft: 24 }}>
            <span style={{ color: '#64748b' }}>- </span>
            <span style={{ color: '#3b82f6' }}>Read</span>
            <span style={{ color: '#64748b' }}>{', '}</span>
            <span style={{ color: '#3b82f6' }}>Grep</span>
            <span style={{ color: '#64748b' }}>{', '}</span>
            <span style={{ color: '#3b82f6' }}>Bash</span>
          </div>

          <div style={{ opacity: line3Opacity }}>
            <span style={{ color: '#f59e0b' }}>---</span>
          </div>

          {/* Natural language instructions */}
          <div style={{ opacity: line4Opacity, marginTop: 8 }}>
            <span style={{ color: '#8b5cf6' }}>{'// '}</span>
            <span style={{ color: '#8b5cf6' }}>用自然语言描述职责</span>
          </div>
          <div style={{ opacity: line4Opacity }}>
            <span style={{ color: '#e2e8f0' }}>你是一个资深代码审查专家。</span>
          </div>
          <div style={{ opacity: line4Opacity }}>
            <span style={{ color: '#e2e8f0' }}>重点检查安全漏洞、性能问题和代码风格。</span>
          </div>
        </div>
      </div>

      {subtitleSegments && (
        <ProgressiveSubtitle segments={subtitleSegments} videoOffset={videoOffset ?? 0} />
      )}
    </AbsoluteFill>
  )
}
