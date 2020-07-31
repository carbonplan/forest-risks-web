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

    if (options['forests']) {
      map.setPaintProperty('forests', 'circle-opacity', 0.8)
    } else {
      map.setPaintProperty('forests', 'circle-opacity', 0)
    }
    if (options['fires']) {
      map.setPaintProperty('fires', 'circle-opacity', 0.8)
    } else {
      map.setPaintProperty('fires', 'circle-opacity', 0)
    }
  }, [map, context, options])
}

export default useOptions
