import { useState } from 'react'
import { Box } from 'theme-ui'
import Stats from './stats'
import Histogram from './histogram'
import Violin from './violin'
import ToggleButton from './toggle-button'

export default function Visualization({ data }) {
  const [mode, setMode] = useState(1)
  return (
    <Box sx={{ flex: 1, padding: 16, position: 'relative' }}>
      <ToggleButton
        onClick={() => setMode((mode + 1) % 3)}
        sx={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          cursor: 'pointer',
        }}
      />
      {(() => {
        switch (mode) {
          case 0:
            return <Stats data={data} />
          case 1:
            return <Violin data={data} />
          case 2:
            return <Histogram data={data} />
        }
      })()}
    </Box>
  )
}
