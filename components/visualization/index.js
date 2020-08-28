import { Box } from 'theme-ui'
import Stats from './stats'
import Histogram from './histogram'

export default function Visualization({ data }) {
  return (
    <Box sx={{ flex: 1, padding: 16 }}>
      <Stats data={data} />
      {/*<Histogram data={data} />*/}
    </Box>
  )
}
