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
    map.setPaintProperty('ne_10m_land', 'fill-color', theme.colors.muted)
    map.setPaintProperty('ne_10m_land', 'fill-opacity', 1)
  }, [map, context])
}

export default useTheme
