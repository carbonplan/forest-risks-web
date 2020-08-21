import { useState } from 'react'
import { Box, Flex } from 'theme-ui'
import Sidebar from './sidebar'
import Map from './map'
import Visualization from './visualization'

function Viewer() {
  const initialOptions = {
    forests: true,
    fires: true,
  }

  const [options, setOptions] = useState(initialOptions)
  const [selectedData, setSelectedData] = useState(null)

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
          '*': {
            userSelect: 'none',
          },
        }}
      >
        <Sidebar options={options} setOptions={setOptions}>
          <Visualization data={selectedData} />
        </Sidebar>
        <Map options={options} onChangeSelectedData={setSelectedData} />
      </Flex>
    </Box>
  )
}

export default Viewer
