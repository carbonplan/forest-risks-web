/*
TODO: handle issues with stats calculation
  1. takes a long time
    - may need to simplify geojson somehow
  2. queryRenderedFeatures still returns data even if you zoom in
  really far and there are no points
    - may need to find the smaller of the two bounding boxes in getSelectedData:
    (1) the bbox of the region, and (2) the bbox of the viewport
*/

import { useRef, useEffect, useState } from 'react'
import { boundingBox } from '@utils'
import FilePicker from './file-picker'
import * as turf from '@turf/turf'

function FileFilter({ map, onChangeRegion = (region) => {}  }) {
  const [clearable, setClearable] = useState(false)

  const onFile = ({ filename, content }) => {
    try {
      content = JSON.parse(content)
    } catch (e) {
      console.log('parse error:', e)
      return
    }

    if (!content || !content.type) return

    const region = (() => {
      switch(content.type) {
        case 'FeatureCollection': return turf.combine(content).features[0]
        case 'Feature': return content
        default: return null
      }
    })()

    if (!region) return null

    region.properties = { filename }

    map.getSource('file').setData(region)
    map.fitBounds(boundingBox(region), { padding: 50 })
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
        'line-color': '#FFF',
      },
    })

    return function cleanup() {
      map.removeLayer('file/line')
      map.removeSource('file')
    }
  }, [])

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
