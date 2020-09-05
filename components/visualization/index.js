import { useState } from 'react'
import { Box } from 'theme-ui'
import Stats from './stats'
import Histogram from './histogram'
import Violin from './violin'

export default function Visualization({ data }) {
  const [mode, setMode] = useState(2)
  return (
    <Box sx={{ flex: 1, padding: 16, position: 'relative' }}>
      <Box
        onClick={() => setMode((mode + 1) % 3)}
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
          case 2: return <Violin data={data} />
        }
      })()}
    </Box>
  )
}
