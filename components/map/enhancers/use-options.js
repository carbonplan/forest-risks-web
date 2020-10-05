import { useState, useEffect } from 'react'
import { useThemeUI } from 'theme-ui'
import * as P from 'polished'

function useOptions(map, options) {
  const context = useThemeUI()
  const theme = context.theme

  useEffect(() => {
    if (options['biomass']) {
      map.setPaintProperty('forests', 'circle-opacity', 1)
      map.setPaintProperty('forests', 'circle-color', {
        property: options['year'].toString(),
        stops: [
          [50, P.rgba(theme.colors.green, 0)],
          [250, theme.colors.green],
        ],
      })
    } else {
      map.setPaintProperty('forests', 'circle-opacity', 0)
    }
    if (options['fire']) {
      map.setPaintProperty('fires', 'circle-opacity', 0.8)
    } else {
      map.setPaintProperty('fires', 'circle-opacity', 0)
    }
  }, [context, options])
}

export default useOptions
