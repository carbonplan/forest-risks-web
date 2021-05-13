import { useState, useEffect } from 'react'
import { useThemeUI } from 'theme-ui'
import { optionKey, colorRanges } from '@constants'
import * as P from 'polished'

function useOptions(map, options) {
  const {
    theme: { rawColors: colors },
  } = useThemeUI()

  useEffect(() => {
    const ranges = colorRanges(options)

    const updateLayer = (name, color) => {
      let key
      key = optionKey(options)
      if (options[name]) {
        map.setPaintProperty(name, 'circle-color', {
          property: key,
          stops: [
            [ranges[name][0], P.rgba(colors[color], 0)],
            [ranges[name][1], colors[color]],
          ],
        })
        map.setPaintProperty(name, 'circle-opacity', 1)
      } else {
        map.setPaintProperty(name, 'circle-opacity', 0)
      }
    }

    updateLayer('biomass', 'green')
    updateLayer('fire', 'orange')
    updateLayer('drought', 'pink')
    updateLayer('insects', 'blue')
  }, [colors, options])
}

export default useOptions
