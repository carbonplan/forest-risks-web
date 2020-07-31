import { useState } from 'react'
import { Box, Flex } from 'theme-ui'
import Sidebar from './sidebar'
import Switch from './switch'
import Map from './map'

function Viewer() {
  const initialOptions = {
    forests: true,
    fires: true,
  }

  const [options, setOptions] = useState(initialOptions)

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
        <Sidebar options={options} setOptions={setOptions}></Sidebar>
        <Map options={options}></Map>
        <Switch />
      </Flex>
    </Box>
  )
}

export default Viewer
