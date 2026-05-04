import React from 'react'
import { useCurrentFrame } from 'remotion'
import { CenteredStack, useStagger, useSlideIn, type SubtitleSegment } from '../../../components'

interface Shot6Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const FONT = 'Noto Sans SC, sans-serif'

const TOOLS = [
  {
    name: 'multi-agent-syncer',
    highlight: true,
    agents: '16+',
    ui: true,
    cli: true,
    projectLevel: true,
    code: '~800行',
    codeNote: '',
  },
  {
    name: 'agent-skills-manager',
    highlight: false,
    agents: '11',
    ui: true,
    cli: false,
    projectLevel: true,
    code: '未公开',
    codeNote: '',
  },
  {
    name: 'skillshare',
    highlight: false,
    agents: '50+',
    ui: true,
    cli: true,
    projectLevel: true,
    code: '未公开',
    codeNote: '',
  },
  {
    name: 'claude-skills',
    highlight: false,
    agents: '5+',
    ui: false,
    cli: true,
    projectLevel: false,
    code: '分散',
    codeNote: '',
  },
]

const COLUMNS = ['代理数', 'UI', 'CLI', '项目级', '代码量']

export const Shot6: React.FC<Shot6Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  // Row stagger reveal
  const rowStagger = useStagger(frame, 4, 10, 14)

  // Column headers slide down
  const headerStyle = useSlideIn(frame, 'down', 0, 30, 12)

  return (
    <CenteredStack
      background="linear-gradient(135deg, #18181B, #27272A)"
      justify="center"
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 860,
          borderRadius: 20,
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '200px repeat(5, 1fr)',
            padding: '16px 20px',
            background: 'rgba(167, 139, 250, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            ...headerStyle.style,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700, color: '#94A3B8', fontFamily: FONT }} />
          {COLUMNS.map((col) => (
            <span
              key={col}
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#A78BFA',
                fontFamily: FONT,
                textAlign: 'center',
              }}
            >
              {col}
            </span>
          ))}
        </div>

        {/* Data rows */}
        {TOOLS.map((tool, i) => (
          <div
            key={tool.name}
            style={{
              display: 'grid',
              gridTemplateColumns: '200px repeat(5, 1fr)',
              padding: '14px 20px',
              alignItems: 'center',
              borderBottom: i < TOOLS.length - 1 ? '1px solid rgba(255, 255, 255, 0.04)' : 'none',
              background: tool.highlight ? 'rgba(167, 139, 250, 0.08)' : 'transparent',
              ...rowStagger[i].style,
            }}
          >
            {/* Tool name */}
            <span
              style={{
                fontSize: 22,
                fontWeight: tool.highlight ? 800 : 500,
                color: tool.highlight ? '#A78BFA' : '#CBD5E1',
                fontFamily: FONT,
              }}
            >
              {tool.name}
            </span>

            {/* Agents count */}
            <span style={{ fontSize: 24, fontWeight: 700, color: '#F8FAFC', fontFamily: FONT, textAlign: 'center' }}>
              {tool.agents}
            </span>

            {/* UI */}
            <span style={{ fontSize: 26, textAlign: 'center' }}>
              {tool.ui ? '✓' : '✗'}
            </span>

            {/* CLI */}
            <span style={{ fontSize: 26, textAlign: 'center', color: tool.cli ? '#34D399' : '#EF4444' }}>
              {tool.cli ? '✓' : '✗'}
            </span>

            {/* Project Level */}
            <span style={{ fontSize: 26, textAlign: 'center', color: tool.projectLevel ? '#34D399' : '#EF4444' }}>
              {tool.projectLevel ? '✓' : '✗'}
            </span>

            {/* Code */}
            <span
              style={{
                fontSize: tool.highlight ? 24 : 22,
                fontWeight: tool.highlight ? 700 : 400,
                color: tool.highlight ? '#34D399' : '#64748B',
                fontFamily: FONT,
                textAlign: 'center',
              }}
            >
              {tool.code}
            </span>
          </div>
        ))}
      </div>
    </CenteredStack>
  )
}
