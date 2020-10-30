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

    const updateLayer = (name, color) => {
      if (options[name]) {
        map.setPaintProperty(name, 'circle-color', {
          property: (name == 'feedbacks') ? '0' : key,
          stops: [
            [ranges[name][0], P.rgba(theme.colors[color], 0)],
            [ranges[name][1], theme.colors[color]],
          ],
        })
        map.setPaintProperty(name, 'circle-opacity', 1)
      } else {
        map.setPaintProperty(name, 'circle-opacity', 0)
      }
    }

    updateLayer('biomass', 'green')
    updateLayer('fire', 'orange')
    updateLayer('drought', 'blue')
    updateLayer('insects', 'pink')
    updateLayer('feedbacks', 'grey')

  }, [context, options])
}

export default useOptions
