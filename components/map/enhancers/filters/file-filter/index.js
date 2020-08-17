import { useRef, useEffect } from 'react'
import { boundingBox } from '../../../geo-utils'

function FileFilter({ map, onChangeRegion = (region) => {}  }) {
  const inputRef = useRef(null)

  const onChange = (e) => {
    const file = e.target.files[0]

    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = (readerEvent) => {
      let content = readerEvent.target.result

      try {
        content = JSON.parse(content)
      } catch (e) {
        console.log('parse error:', e)
        return
      }

      if (!content || !content.type) return

      const region = (() => {
        switch(content.type) {
          case 'FeatureCollection': return content.features[0]
          case 'Feature': return content
          default: return null
        }
      })()

      if (!region) return null

      region.properties = {
        type: 'File',
        filename: file.name,
      }

      map.getSource('file').setData(region)
      map.fitBounds(boundingBox(region), { padding: 50 })

      /*
      TODO: handle issues with stats calculation
        1. takes a long time
          - may need to simplify geojson somehow
        2. queryRenderedFeatures still returns data even if you zoom in
        really far and there are no points
          - may need to find the smaller of the two bounding boxes in getSelectedData:
          (1) the bbox of the region, and (2) the bbox of the viewport
      */
      map.once('moveend', () => onChangeRegion(region))
    }
  }

  useEffect(() => {
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

    inputRef.current.click()

    return function cleanup() {
      map.removeLayer('file/line')
      map.removeSource('file')
    }
  }, [])

  return (
    <input
      ref={inputRef}
      type="file"
      style={{ display: 'none' }}
      onChange={onChange}
    />
  )
}

export default FileFilter
