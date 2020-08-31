import { useState, useEffect } from 'react'
import { Box, Flex } from 'theme-ui'
import Sidebar from './sidebar'
import Map from './map'
import Visualization from './visualization'
import { filterTypes } from '@constants'
import { getSelectedData } from './map/enhancers/filters/helpers'

function Viewer() {
  const initialOptions = {
    forests: true,
    fires: true,
  }

  const [map, setMap] = useState(null)
  const [region, setRegion] = useState(null)
  const [bounds, setBounds] = useState(null)
  const [options, setOptions] = useState(initialOptions)
  const [selectedData, setSelectedData] = useState(null)

  useEffect(() => {
    if (!map) return

    const layers = Object.keys(options).filter((key) => options[key])
    const data = getSelectedData(map, layers, region)
    setSelectedData(data)
  }, [map, options, region, bounds])

  useEffect(() => {
    if (!map || !region || region.properties.type === filterTypes.VIEWPORT)
      return

    const onMoveEnd = () => setBounds(map.getBounds())
    map.on('moveend', onMoveEnd)
    return function cleanup() {
      map.off('moveend', onMoveEnd)
    }
  }, [map, region])

  return (
    <Box>
      <Flex
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          flexDirection: ['column', 'row', 'row'],
          overflow: 'hidden',
          '*': {
            userSelect: 'none',
          },
        }}
      >
        <Sidebar options={options} setOptions={setOptions}>
          <Visualization data={selectedData} />
        </Sidebar>
        <Map
          options={options}
          onChangeRegion={setRegion}
          onMapReady={setMap}
        />
      </Flex>
    </Box>
  )
}

export default Viewer
