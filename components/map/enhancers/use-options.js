import { useState, useEffect } from 'react'
import { useThemeUI } from 'theme-ui'
import { darken } from '@theme-ui/color'

function useOptions(map, options) {
  const context = useThemeUI()
  const theme = context.theme

  useEffect(() => {
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
  }, [context, options])
}

export default useOptions
