import { useState, useLayoutEffect } from 'react'
import { useThemeUI } from 'theme-ui'

function useOptions(map, options) {
  const context = useThemeUI()
  const theme = context.theme

  useLayoutEffect(() => {
    if (!map) {
      return
    }

    if (options['reforestation']) {
      map.setPaintProperty('ne_10m_land', 'fill-color', theme.colors.green)
    } else {
      map.setPaintProperty('ne_10m_land', 'fill-color', theme.colors.muted)
    }
  }, [map, context, options])
}

export default useOptions
