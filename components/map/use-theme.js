import { useState, useLayoutEffect } from 'react'
import { useThemeUI } from 'theme-ui'

function useTheme(map) {
  const context = useThemeUI()
  const theme = context.theme

  useLayoutEffect(() => {
    if (!map) {
      return
    }

    map.setPaintProperty(
      'background',
      'background-color',
      theme.colors.background
    )
    map.setPaintProperty('background', 'background-opacity', 1)
    map.setPaintProperty('land', 'fill-color', theme.colors.muted)
    map.setPaintProperty('land', 'fill-opacity', 0.5)
    map.setPaintProperty('urban', 'fill-color', theme.colors.muted)
    map.setPaintProperty('urban', 'fill-opacity', 1)
    map.setPaintProperty('countries', 'line-color', theme.colors.primary)
    map.setPaintProperty('countries', 'line-opacity', 1)
    map.setPaintProperty('states', 'line-color', theme.colors.primary)
    map.setPaintProperty('states', 'line-opacity', 1)
  }, [map, context])
}

export default useTheme
