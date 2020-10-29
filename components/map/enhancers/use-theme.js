import { useState, useEffect } from 'react'
import { useThemeUI } from 'theme-ui'

function useTheme(map) {
  const context = useThemeUI()
  const theme = context.theme

  useEffect(() => {
    map.setPaintProperty(
      'background',
      'background-color',
      theme.colors.background
    )
    map.setPaintProperty('background', 'background-opacity', 1)
    map.setPaintProperty('land', 'fill-opacity', 0)
    map.setPaintProperty('lakes', 'fill-color', theme.colors.muted)
    map.setPaintProperty('lakes', 'fill-opacity', 0.25)
    map.setPaintProperty('countries', 'line-color', theme.colors.primary)
    map.setPaintProperty('countries', 'line-opacity', 0.25)
    map.setPaintProperty('states', 'line-color', theme.colors.primary)
    map.setPaintProperty('states', 'line-opacity', 0.4)
    map.setPaintProperty('roads', 'line-color', theme.colors.primary)
    map.setPaintProperty('roads', 'line-opacity', 0.2)
  }, [context])
}

export default useTheme
