import { AbsoluteFill } from 'remotion'
import React from 'react'
import { SAFE_AREA } from './constants'

interface SafeAreaProps {
  children: React.ReactNode
  style?: React.CSSProperties
  /** Use content safe bottom (includes subtitle zone). Default: true */
  contentSafe?: boolean
}

export const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  style,
  contentSafe = true,
}) => (
  <AbsoluteFill style={{
    padding: `${SAFE_AREA.TOP}px ${SAFE_AREA.LEFT}px ${contentSafe ? SAFE_AREA.CONTENT_BOTTOM : SAFE_AREA.BOTTOM}px`,
    boxSizing: 'border-box',
    ...style,
  }}>
    {children}
  </AbsoluteFill>
)
