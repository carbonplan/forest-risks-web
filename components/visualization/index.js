import { useState } from 'react'
import { Box } from 'theme-ui'
import Stats from './stats'
import Histogram from './histogram'

export default function Visualization({ data }) {
  const [mode, setMode] = useState(0)
  return (
    <Box sx={{ flex: 1, padding: 16, position: 'relative' }}>
      <Box
        onClick={() => setMode(1 - mode)}
        sx={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          width: '15px',
          height: '15px',
          backgroundColor: 'red',
          cursor: 'pointer'
        }}
      />
      {(() => {
        switch(mode) {
          case 0: return <Stats data={data} />
          case 1: return <Histogram data={data} />
        }
      })()}
    </Box>
  )
}
