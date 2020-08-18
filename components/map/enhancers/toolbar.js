import { Box } from 'theme-ui'
import { useState, useRef, useEffect } from 'react'

export default function Toolbar({ children }) {
  const [top, setTop] = useState(null)
  const boxRef = useRef(null)

  useEffect(() => {
    let offset
    const { height } = boxRef.current.getBoundingClientRect()
    const onMouseMove = (e) => setTop(e.clientY - offset)

    const onMouseUp = (e) => {
      window.removeEventListener('mousemove', onMouseMove)
      boxRef.current.style.cursor = 'grab'
    }

    const onMouseDown = (e) => {
      offset = e.offsetY
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp, { once: true })
      boxRef.current.style.cursor = 'grabbing'
    }

    boxRef.current.addEventListener('mousedown', onMouseDown)
    return function cleanup() {
      boxRef.current.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  return (
    <Box
      ref={boxRef}
      sx={{
        position: 'absolute',
        top: top !== null ? `${top}px` : '60%',
        left: 0,
        backgroundColor: 'background',
        backgroundOpacity: 0.5,
        zIndex: 100,
        height: 260,
        width: 60,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 0,
        borderStyle: 'solid',
        borderColor: 'muted',
        cursor: 'grab',
      }}
    >
      { children }
    </Box>
  )
}

export function Divider() {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 20,
        width: 16,
        bottom: 92,
        height: 1,
        backgroundColor: 'secondary',
        zIndex: 1,
      }}
    />
  )
}
