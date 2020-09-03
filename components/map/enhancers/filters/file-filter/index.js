import { useRef, useEffect, useState } from 'react'
import { bbox } from '@utils/turf'
import FilePicker from './file-picker'
import * as turf from '@utils/turf'
import { useThemeUI } from 'theme-ui'

function FileFilter({ map, onChangeRegion = (region) => {} }) {
  const [clearable, setClearable] = useState(false)
  const context = useThemeUI()

  const onFile = ({ filename, content }) => {
    try {
      content = JSON.parse(content)
    } catch (e) {
      alert('could not parse')
      return
    }

    if (!content || !content.type) return

    const region = (() => {
      switch (content.type) {
        case 'FeatureCollection':
          return turf.combine(content).features[0]
        case 'Feature':
          return content
        default:
          return null
      }
    })()

    if (!region) return null

    region.properties = { filename }

    map.getSource('file').setData(region)
    map.fitBounds(bbox(region), { padding: 50 })
    map.once('moveend', () => {
      setClearable(true)
      onChangeRegion(region)
    })
  }

  const clear = () => {
    map.getSource('file').setData({
      type: 'FeatureCollection',
      features: [],
    })
    setClearable(false)
    onChangeRegion(null)
  }

  useEffect(() => {
    onChangeRegion(null)

    map.addSource('file', {
      type: 'geojson',
      data: null,
    })

    map.addLayer({
      id: 'file/line',
      source: 'file',
      type: 'line',
      paint: {
        'line-width': 3.0,
      },
    })

    return function cleanup() {
      map.removeLayer('file/line')
      map.removeSource('file')
    }
  }, [])

  useEffect(
    function setLineColor() {
      map.setPaintProperty(
        'file/line',
        'line-color',
        context.theme.colors.primary
      )
    },
    [context]
  )

  return (
    <FilePicker
      map={map}
      onFile={onFile}
      clearable={clearable}
      onClear={clear}
    />
  )
}

export default FileFilter
