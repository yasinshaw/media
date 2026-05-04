import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import { CenteredStack, useFadeIn, type SubtitleSegment } from '../../../components'

interface Shot4Props {
  subtitleSegments?: SubtitleSegment[]
  videoOffset?: number
}

const FONT = 'Noto Sans SC, sans-serif'

interface CommandBlock {
  command: string
  output: string
  outputColor: string
  startFrame: number
}

const COMMANDS: CommandBlock[] = [
  {
    command: '$ sync --skills tavily-search --to claude,cursor',
    output: '✓ Synced',
    outputColor: '#34D399',
    startFrame: 0,
  },
  {
    command: '$ status',
    output: 'claude  ✓ tavily-search\ncursor  ✓ tavily-search\ncodex   ✗ not synced',
    outputColor: '#94A3B8',
    startFrame: 140,
  },
  {
    command: '$ sync --skills react --to claude --project ./my-app',
    output: '✓ Synced',
    outputColor: '#34D399',
    startFrame: 300,
  },
]

const TYPEWRITER_SPEED = 2 // chars per frame

function useTypewriter(frame: number, text: string, startFrame: number, speed = TYPEWRITER_SPEED) {
  const elapsed = Math.max(0, frame - startFrame)
  const charCount = Math.min(text.length, Math.floor(elapsed / speed))
  return text.slice(0, charCount)
}

export const Shot4: React.FC<Shot4Props> = ({ subtitleSegments, videoOffset }) => {
  const frame = useCurrentFrame()

  const terminalEntry = useFadeIn(frame, 0, 15)

  return (
    <CenteredStack
      background="linear-gradient(135deg, #0C4A6E, #075985)"
      justify="center"
      subtitleSegments={subtitleSegments}
      videoOffset={videoOffset}
    >
      {/* Terminal mock-up */}
      <div
        style={{
          width: '100%',
          maxWidth: 860,
          borderRadius: 16,
          overflow: 'hidden',
          background: '#0d1117',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          ...terminalEntry.style,
        }}
      >
        {/* macOS title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 20px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
          <span
            style={{
              marginLeft: 12,
              fontSize: 20,
              color: '#64748B',
              fontFamily: FONT,
            }}
          >
            agent-syncer
          </span>
        </div>

        {/* Terminal content */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {COMMANDS.map((cmd, i) => {
            const typedCommand = useTypewriter(frame, cmd.command, cmd.startFrame)
            const commandDone = typedCommand.length === cmd.command.length
            const outputDelay = cmd.startFrame + Math.ceil(cmd.command.length / TYPEWRITER_SPEED) + 8

            const outputOpacity = interpolate(
              frame,
              [outputDelay, outputDelay + 10],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            )

            const cursorVisible = !commandDone && frame % 20 < 12

            return (
              <div key={i}>
                {/* Command line */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 26,
                      fontFamily: 'monospace',
                      color: '#38BDF8',
                      whiteSpace: 'pre',
                      lineHeight: 1.6,
                    }}
                  >
                    {typedCommand}
                    <span
                      style={{
                        display: 'inline-block',
                        width: 14,
                        height: 28,
                        background: '#38BDF8',
                        verticalAlign: 'text-bottom',
                        marginLeft: 2,
                        opacity: cursorVisible ? 1 : 0,
                      }}
                    />
                  </span>
                </div>

                {/* Output — always in DOM to prevent height jump */}
                <div
                  style={{
                    marginTop: 6,
                    opacity: outputOpacity,
                    whiteSpace: 'pre',
                    visibility: commandDone ? 'visible' : 'hidden',
                  }}
                >
                  {cmd.output.split('\n').map((line, lineIdx) => (
                    <span
                      key={lineIdx}
                      style={{
                        fontSize: 24,
                        fontFamily: 'monospace',
                        lineHeight: 1.6,
                        display: 'block',
                        color:
                          line.includes('✗')
                            ? '#EF4444'
                            : cmd.outputColor,
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </CenteredStack>
  )
}
