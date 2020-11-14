/** @jsx jsx */
import { useState } from 'react'
import { jsx, Text, IconButton, useThemeUI } from 'theme-ui'

const Info = ({ children }) => {
  const context = useThemeUI()
  const theme = context.theme

  const [expanded, setExpanded] = useState(false)
  const toggle = (e) => {
    setExpanded(!expanded)
  }

  const sx = {
    body: {
      ontFamily: 'body',
      letterSpacing: 'body',
      textTransform: 'none',
      fontFamily: 'body',
      fontSize: [1],
      mt: [2],
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
          position: 'absolute',
          right: 10,
          mt: '-6px',
          '&:hover > #icon': {
            stroke: 'text',
          },
          p: [0],
        }}
      >
        <svg
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
          <>
            <line x1='13' y1='12.3' x2='13' y2='19.5' />
            <line x1='13' y1='7.9' x2='13' y2='10.1' />
            <circle cx='13' cy='13' r='12' />
          </>
        </svg>
      </IconButton>
      {expanded && <Text sx={sx.body}>{children}</Text>}
    </>
  )
}

export default Info
