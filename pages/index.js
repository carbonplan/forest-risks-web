import { Box } from 'theme-ui'
import { Button } from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'

function Index() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Button
        size='xl'
        href='/research/forest-risks'
        suffix={<RotatingArrow sx={{ color: 'orange' }} />}
      >
        Go to map
      </Button>
    </Box>
  )
}

export default Index
