import { useState, useEffect } from 'react'
import { useThemeUI } from 'theme-ui'
import { optionKey, colorRanges } from '@constants'
import * as P from 'polished'

function useOptions(map, options) {
  const context = useThemeUI()
  const theme = context.theme

  useEffect(() => {
    const key = optionKey(options)
    const ranges = colorRanges(options)

    if (options['biomass']) {
      map.setPaintProperty('biomass', 'circle-color', {
        property: key,
        stops: [
          [ranges.biomass[0], P.rgba(theme.colors.green, 0)],
          [ranges.biomass[1], theme.colors.green],
        ],
      })
      map.setPaintProperty('biomass', 'circle-opacity', 1)
    } else {
      map.setPaintProperty('biomass', 'circle-opacity', 0)
    }
    if (options['fire']) {
      map.setPaintProperty('fire', 'circle-color', {
        property: key,
        stops: [
          [ranges.fire[0], P.rgba(theme.colors.orange, 0)],
          [ranges.fire[1], theme.colors.orange],
        ],
      })
      map.setPaintProperty('fire', 'circle-opacity', 1)
    } else {
      map.setPaintProperty('fire', 'circle-opacity', 0)
    }
  }, [context, options])
}

export default useOptions
