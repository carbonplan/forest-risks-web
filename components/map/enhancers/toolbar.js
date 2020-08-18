import { Box } from 'theme-ui'
import { useState, useRef, useEffect } from 'react'

export default function Toolbar({ map, children }) {
  const boxRef = useRef(null)

  const [bottom, setBottom] = useState(100)
  const [moving, setMoving] = useState(false)

  const onMouseDown = e => {
    const mapContainer = map.getContainer()
    const { height: toolbarHeight } = boxRef.current.getBoundingClientRect()
    const { height: mapHeight } = mapContainer.getBoundingClientRect()
    const offset = e.offsetY

    const onMouseMove = (e) => {
      let bottom = mapHeight - e.clientY - toolbarHeight + offset
      if (bottom < 0) bottom = 0
      if (bottom > mapHeight - toolbarHeight) bottom = mapHeight - toolbarHeight
      setBottom(bottom)
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

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: `${bottom}px`,
        left: 0,
        zIndex: 2,
      }}
    >
      <Box
        ref={boxRef}
        onMouseDown={e => {
          if (e.defaultPrevented) return
          onMouseDown(e.nativeEvent)
        }}
        sx={{
          backgroundColor: 'background',
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderLeftWidth: 0,
          borderStyle: 'solid',
          borderColor: 'muted',
          cursor: moving ? 'grabbing' : 'grab',
          padding: '12px',
        }}
      >
        <Box
          onMouseDown={e => e.preventDefault()}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            '& > button': {
              marginTop: '2px',
              marginBottom: '2px',
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
      sx={{
        width: 16,
        height: 1,
        backgroundColor: 'secondary',
        margin: '8px auto',
      }}
    />
  )
}
