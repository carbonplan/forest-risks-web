import { Box } from 'theme-ui'
import { useState, useRef } from 'react'

export default function Toolbar({ map, children, position }) {
  const toolbar = useRef(null)

  const styles = (() => {
    switch (position) {
      case 'left':
        return {
          guide: {
            left: 0,
            bottom: `0px`,
          },
          outer: {
            px: '16px',
          },
          inner: {
            flexDirection: 'row',
          },
          button: {
            marginTop: '2px',
            marginBottom: '2px',
          },
          divider: {
            width: 1,
            height: 16,
            margin: '0 8px',
          },
        }
      case 'right':
        return {
          guide: {
            right: `0px`,
            bottom: 0,
          },
          outer: {},
          inner: {
            flexDirection: 'row',
          },
          button: {
            marginLeft: '2px',
            marginRight: '2px',
          },
          divider: {
            width: 1,
            height: 16,
            margin: '0 8px',
          },
        }
    }
  })()

  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 2,
        display: ['none', 'initial', 'initial'],
        ...styles.guide,
      }}
    >
      <Box
        ref={toolbar}
        sx={{
          cursor: 'default',
          px: '11px',
          py: '15px',
          ...styles.outer,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            ...styles.inner,
            '& > button': {
              ...styles.button,
            },
            '& > .divider': {
              ...styles.divider,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export function Divider() {
  return <Box className='divider' sx={{ backgroundColor: 'secondary' }} />
}
