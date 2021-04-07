import { useState, useEffect } from 'react'
import { useThemeUI } from 'theme-ui'

function useTheme(map) {
  const { theme: { rawColors: colors } } = useThemeUI()

  useEffect(() => {
    map.setPaintProperty(
      'background',
      'background-color',
      colors.background
    )
    map.setPaintProperty('background', 'background-opacity', 1)
    map.setPaintProperty('lakes', 'fill-color', colors.muted)
    map.setPaintProperty('lakes', 'fill-opacity', 0.25)
    map.setPaintProperty('countries', 'line-color', colors.primary)
    map.setPaintProperty('countries', 'line-opacity', 0.25)
    map.setPaintProperty('states', 'line-color', colors.primary)
    map.setPaintProperty('states', 'line-opacity', 0.4)
    map.setPaintProperty('roads', 'line-color', colors.primary)
    map.setPaintProperty('roads', 'line-opacity', 0.2)
  }, [colors])
}

export default useTheme
