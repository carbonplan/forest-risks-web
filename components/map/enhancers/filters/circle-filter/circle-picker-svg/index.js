import { useState, useEffect } from 'react'
import { useThemeUI } from 'theme-ui'
import CircleRenderer from './circle-renderer'

const CirclePicker = ({ map, center, radius, onIdle, onDrag }) => {
  const [renderer, setRenderer] = useState(null)
  const { theme } = useThemeUI()

  useEffect(() => {
    const renderer = CircleRenderer({
      map,
      onIdle,
      onDrag,
      initialCenter: center,
      initialRadius: radius,
    })

    setRenderer(renderer)

    return function cleanup() {
      // need to check load state for fast-refresh purposes
      if (map.loaded()) renderer.remove()
    }
  }, [])

  return (
    <svg
      id='circle-picker'
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <path
        id='circle'
        stroke={theme.colors.primary}
        strokeWidth={1}
        fill='transparent'
        cursor='move'
      />
      <mask id='circle-mask'>
        <rect x='0' y='0' width='100%' height='100%' fill='#FFFFFF' />
        <path id='circle-mask-cutout' fill='#000000' />
      </mask>
      <rect
        x='0'
        y='0'
        width='100%'
        height='100%'
        mask='url(#circle-mask)'
        fill={theme.colors.background}
        fillOpacity={0.8}
      />
      <circle
        id='handle'
        r={8}
        fill={theme.colors.primary}
        cursor='ew-resize'
      />
      <line
        id='radius-guideline'
        stroke={theme.colors.primary}
        strokeOpacity={0}
        strokeWidth={1}
        strokeDasharray='3,2'
      />
      <g id='radius-text-container'>
        <text
          id='radius-text'
          textAnchor='middle'
          fill={theme.colors.primary}
        />
      </g>
    </svg>
  )
}

export default CirclePicker
