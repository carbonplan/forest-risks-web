import { useState, useEffect } from 'react'
import { useThemeUI } from 'theme-ui'
import CircleRenderer from './circle-renderer'

const CirclePicker = ({ map, center, radius, onIdle, onDrag, onSetRadius }) => {
  const [renderer, setRenderer] = useState(null)
  const { theme } = useThemeUI()

  useEffect(() => {
    const renderer = CircleRenderer({
      map,
      onIdle,
      onDrag,
      onSetRadius,
      initialCenter: center,
      initialRadius: radius,
    })

    setRenderer(renderer)

    return function cleanup() {
      // need to check load state for fast-refresh purposes
      if (map.loaded()) renderer.remove()
    }
  }, [])

  useEffect(() => {
    if (renderer) {
      renderer.setCenter(center)
    }
  }, [renderer, center])

  useEffect(() => {
    if (renderer) {
      renderer.setRadius(radius)
    }
  }, [renderer, radius])

  return (
    <svg
      id="circle-picker"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}>
      <path
        id="circle"
        stroke={theme.colors.primary}
        strokeWidth={3}
        fill="transparent"
        cursor="move"
      />
      <circle
        id="circle-center"
        fill={theme.colors.primary}
        r={4}
      />
      <mask id="circle-mask">
        <rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" />
        <path id="circle-mask-cutout" fill="#000000" />
      </mask>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        mask="url(#circle-mask)"
        fill={theme.colors.primary}
        fillOpacity={0.2}
      />
      <circle
        id="handle"
        r={8}
        fill={theme.colors.primary}
        cursor="ew-resize"
      />
      <line
        id="radius-guideline"
        stroke={theme.colors.primary}
        strokeOpacity={0}
        strokeWidth={2}
        strokeDasharray="3,2"
      />
      <text
        id="radius-text"
        fill={theme.colors.primary}
        fillOpacity={0}
      />
      <circle
        id="circle-xy"
        stroke="red"
        strokeWidth={3}
        strokeOpacity={0}
        fill="transparent"
      />
    </svg>
  )
}

export default CirclePicker
