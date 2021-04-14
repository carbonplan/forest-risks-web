import { useState } from 'react'
import { Box, IconButton, useThemeUI } from 'theme-ui'
import AnimateHeight from 'react-animate-height'

const Info = ({ children }) => {
  const context = useThemeUI()
  const theme = context.theme

  const [expanded, setExpanded] = useState(false)
  const toggle = (e) => {
    setExpanded(!expanded)
  }

  const sx = {
    body: {
      fontFamily: 'body',
      letterSpacing: 'body',
      textTransform: 'none',
      fontFamily: 'body',
      fontSize: [1],
      maxWidth: '100%',
      pb: [2]
    },
  }

  return (
    <>
      <IconButton
        onClick={toggle}
        aria-label='Toggle more info'
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          float: 'right',
          mr: '-8px',
          mt: '-6px',
          '&:hover > #icon': {
            stroke: 'text',
          },
          p: [0],
        }}
      >
        <Box
          as='svg'
          height={'18px'}
          width={'18px'}
          stroke='none'
          fill='none'
          viewBox={'0 0 30 30'}
          id='icon'
          sx={{
            strokeWidth: '1.4px',
            stroke: expanded ? 'text' : 'muted',
            transform: 'translate(0px, 5px)',
            transition: '0.1s',
          }}
        >
          <line x1='13' y1='12.3' x2='13' y2='19.5' />
          <line x1='13' y1='7.9' x2='13' y2='10.1' />
          <circle cx='13' cy='13' r='12' />
        </Box>
      </IconButton>
      <Box sx={{pt: [2], mb: [-2]}}>
      <AnimateHeight
        duration={100}
        height={expanded ? 'auto' : 0}
        easing={'linear'}
      >
      <Box sx={sx.body}>{children}</Box>
      </AnimateHeight>
      </Box>
    </>
  )
}

export default Info
