import { useState, useLayoutEffect } from 'react'
import { useThemeUI } from 'theme-ui'
import { darken } from '@theme-ui/color'

function useOptions(map, options) {
  const context = useThemeUI()
  const theme = context.theme

  useLayoutEffect(() => {
    if (!map) {
      return
    }

    if (options['reforestation']) {
      map.setPaintProperty('land', 'fill-color', theme.colors.green)
      map.setPaintProperty('land', 'fill-opacity', 1)
    } else {
      map.setPaintProperty('land', 'fill-color', theme.colors.background)
      map.setPaintProperty('land', 'fill-opacity', 1)
    }
  }, [map, context, options])
}

export default useOptions
