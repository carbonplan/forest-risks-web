import { useRef, useEffect } from 'react'
import { IconButton, useThemeUI } from 'theme-ui'
import { boundingBox } from '../../../geo-utils'

const FileFilter = ({ map, onChangeRegion = (region) => {}  }) => {
  const inputRef = useRef(null)

  const onChange = e => {
    const file = e.target.files[0]
    const { name: filename, size, type } = file

    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = readerEvent => {
      const content = readerEvent.target.result;

      // TODO: handle multiple features?
      const region = JSON.parse(content).features[0]
      region.properties = {
        type: 'UserUploaded',
        filename,
      }

      map.addSource(filename, {
        type: 'geojson',
        data: region,
      })

      map.addLayer({
        id: `${filename}/line`,
        source: filename,
        type: 'line',
        paint: {
          'line-width': 3.0,
          'line-color': '#FFF',
        },
      })

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
    inputRef.current.click()
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
