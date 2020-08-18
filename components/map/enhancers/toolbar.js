import { Box } from 'theme-ui'
import { useState, useRef, useEffect } from 'react'

export default function Toolbar({ children }) {
  const boxRef = useRef(null)

  const [top, setTop] = useState(null)
  const [moving, setMoving] = useState(false)

  const onMouseDown = e => {
    let offset = e.offsetY
    const { height } = boxRef.current.getBoundingClientRect()

    const onMouseMove = (e) => setTop(e.clientY - offset)

    const onMouseUp = (e) => {
      window.removeEventListener('mousemove', onMouseMove)
      setMoving(false)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp, { once: true })
    setMoving(true)
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: top !== null ? `${top}px` : '60%',
        left: 0,
        zIndex: 100,
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
