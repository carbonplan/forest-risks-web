import { Box } from 'theme-ui'
import { useState, useRef, useEffect } from 'react'

export default function Toolbar({ map, children }) {
  const toolbar = useRef(null)

  const [position, setPosition] = useState('left')
  const [edge, setEdge] = useState(50)
  const [moving, setMoving] = useState(false)

  const onMouseDown = e => {
    const mapContainer = map.getContainer()
    const { height: toolbarHeight } = toolbar.current.getBoundingClientRect()
    const { height: mapHeight } = mapContainer.getBoundingClientRect()
    const offset = e.offsetY

    const onMouseMove = (e) => {
      let edge = mapHeight - e.clientY - toolbarHeight + offset
      if (edge < 0) edge = 0
      if (edge > mapHeight - toolbarHeight) edge = mapHeight - toolbarHeight
      setEdge(edge)
    }

    const onMouseUp = (e) => {
      mapContainer.removeEventListener('mousemove', onMouseMove)
      setMoving(false)
    }

    mapContainer.addEventListener('mousemove', onMouseMove)
    mapContainer.addEventListener('mouseup', onMouseUp, { once: true })
    mapContainer.addEventListener('mouseleave', onMouseUp, { once: true })
    setMoving(true)
  }

  const styles = (() => {
    switch(position) {
      case 'left': return {
        guide: {
          left: 0,
          bottom: `${edge}px`,
        },
        outer: {
          borderBottomWidth: 1,
          borderLeftWidth: 0,
          borderBottomRightRadius: 5,
        },
        inner: {
          flexDirection: 'column',
        },
        button: {
          marginTop: '2px',
          marginBottom: '2px',
        },
        divider: {
          width: 16,
          height: 1,
          margin: '8px 0',
        },
      }
      case 'bottom': return {
        guide: {
          left: `${edge}px`,
          bottom: 0,
        },
        outer: {
          borderBottomWidth: 0,
          borderLeftWidth: 1,
          borderTopLeftRadius: 5,
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
        onMouseDown={e => {
          if (e.defaultPrevented) return
          onMouseDown(e.nativeEvent)
        }}
        sx={{
          backgroundColor: 'background',
          borderTopRightRadius: 5,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderStyle: 'solid',
          borderColor: 'muted',
          cursor: moving ? 'grabbing' : 'grab',
          padding: '12px',
          ...styles.outer,
        }}
      >
        <Box
          onMouseDown={e => e.preventDefault()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            ...styles.inner,
            '& > button': {
              ...styles.button,
            },
            '& > .divider': {
              ...styles.divider,
            },
          }}
        >
          { children }
        </Box>
      </Box>
    </Box>
  )
}

export function Divider() {
  return (
    <Box
      className="divider"
      sx={{ backgroundColor: 'secondary' }}
    />
  )
}
