import { useState } from 'react'
import { Box, Flex } from 'theme-ui'
import Sidebar from './sidebar'
import Switch from './switch'
import Map from './map'
import Visualization from './Visualization'

function Viewer() {
  const initialOptions = {
    forests: true,
    fires: true,
  }

  const [options, setOptions] = useState(initialOptions)
  const [mapData, setMapData] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)

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
        }}
      >
        <Sidebar options={options} setOptions={setOptions}>
          <Visualization mapData={mapData} filterRegion={selectedRegion} />
        </Sidebar>
        <Map
          options={options}
          onChangeData={setMapData}
          onChangeSelectedRegion={setSelectedRegion}
        />
        <Switch />
      </Flex>
    </Box>
  )
}

export default Viewer
