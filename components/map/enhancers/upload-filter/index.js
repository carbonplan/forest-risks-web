import { useRef } from 'react'
import { IconButton, useThemeUI } from 'theme-ui'
import { getSelectedData } from '../circle-filter/helpers'
import { boundingBox } from '../../geo-utils'

const UploadFilter = ({ map, options, onChangeSelectedData = (region) => {}  }) => {
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
      map.once('moveend', () => {
        const layers = Object.keys(options).filter((key) => options[key])
        const selectedData = getSelectedData(map, layers, region)
        onChangeSelectedData(selectedData)
      })
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={onChange}
      />
      <IconButton
        aria-label='Upload geojson'
        onClick={() => inputRef.current.click()}
        sx={{
          position: 'absolute',
          bottom: 40,
          left: 12,
          zIndex: 1,
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          width='24'
          height='24'
          strokeWidth='1.75'
          fill='none'
        >
          <circle cx='12' cy='12' r='10' />
          <line x1='9' x2='9' y1='2' y2='22' />
          <line x1='15' x2='15' y1='2' y2='22' />
          <line x1='2' x2='22' y1='9' y2='9' />
          <line x1='2' x2='22' y1='15' y2='15' />
        </svg>
      </IconButton>
    </>
  )
}

export default UploadFilter
