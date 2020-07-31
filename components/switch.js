/** @jsx jsx */
import { jsx, Box, IconButton, Text } from 'theme-ui'
import { useColorMode } from 'theme-ui'
import { useState, useEffect } from 'react'

const Switch = (props) => {
  const [colorMode, setColorMode] = useColorMode()
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const toggle = (e) => {
    if (colorMode == 'light') setColorMode('dark')
    else setColorMode('light')
  }

  useEffect(() => {
    const setFromEvent = (e) => setCoords({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', setFromEvent)
    return () => {
      window.removeEventListener('mousemove', setFromEvent)
    }
  }, [])

  const color = '#7eb36a' // TODO: Get from pointer

  return (
    <Box
      sx={{
        position: 'absolute',
        right: '20px',
        bottom: '20px',
      }}
    >
      <IconButton
        aria-label='Toggle dark mode'
        onClick={() => toggle()}
        sx={{
          position: 'relative',
          top: '8px',
          left: '7px',
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          width='24'
          height='24'
          strokeWidth='2'
          fill='none'
        >
          <circle cx='12' cy='12' r='4.77' />
          <line x1='12' x2='12' y2='4.06' />
          <line x1='12' y1='19.94' x2='12' y2='24' />
          <line x1='20.49' y1='3.51' x2='17.61' y2='6.39' />
          <line x1='6.39' y1='17.61' x2='3.51' y2='20.49' />
          <line x1='20.49' y1='20.49' x2='17.61' y2='17.61' />
          <line x1='6.39' y1='6.39' x2='3.51' y2='3.51' />
          <line x1='24' y1='12' x2='19.94' y2='12' />
          <line x1='4.06' y1='12' y2='12' />
        </svg>
      </IconButton>
    </Box>
  )
}

export default Switch
