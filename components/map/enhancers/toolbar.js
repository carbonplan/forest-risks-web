import { Box } from 'theme-ui'
import { useState, useRef } from 'react'

export default function Toolbar({ map, children, position }) {
  const toolbar = useRef(null)

  const [edge, setEdge] = useState(0)

  const styles = (() => {
    switch (position) {
      case 'left':
        return {
          guide: {
            left: 0,
            bottom: `${edge}px`,
          },
          outer: {
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 0,
            borderLeftWidth: 0,
            borderTopRightRadius: 4,
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
            right: `${edge}px`,
            bottom: 0,
          },
          outer: {
            borderBottomWidth: 0,
            borderLeftWidth: 1,
            borderRightWidth: 0,
            borderTopLeftRadius: 4,
          },
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
        ...styles.guide,
      }}
    >
      <Box
        ref={toolbar}
        sx={{
          backgroundColor: 'background',
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: 'muted',
          cursor: 'default',
          padding: '12px',
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
