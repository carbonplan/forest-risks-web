import { useRef, useEffect, useState } from 'react'
import { Box, Button } from 'theme-ui'

function FilePicker({ map, onFile = () => {} }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = file => {
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = (readerEvent) => {
      onFile({
        filename: file.name,
        content: readerEvent.target.result
      })
    }
  }

  useEffect(() => {
    const container = map.getContainer()
    const listeners = []

    const listen = (eventName, func) => {
      container.addEventListener(eventName, func)
      listeners.push([eventName, func])
    }

    const trap = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    listen('drop', (e) => {
      trap(e)
      handleFile(e.dataTransfer.files[0])
      setDragging(false)
    })

    listen('dragenter', (e) => {
      trap(e)
      setDragging(true)
    })

    listen('dragleave', (e) => {
      trap(e)
      setDragging(false)
    })

    listen('dragover', trap)

    return function cleanup() {
      listeners.forEach(([eventName, func]) => {
        container.removeEventListener(eventName, func)
      })
    }
  }, [])

  return (
    <>
      <Box
        sx={{
          fontFamily: 'faux',
          fontSize: 20,
          position: 'absolute',
          top: 50,
          left: 12,
          borderWidth: 2,
          borderColor: 'primary',
          borderStyle: 'solid',
          borderRadius: 5,
          backgroundColor: 'background',
          padding: 10,
          textAlign: 'center'
        }}
      >
        <Box sx={{ marginBottom: 10 }}>Drag GeoJson Onto Map</Box>
        <Box sx={{ marginBottom: 10 }}>OR</Box>
        <Button
          sx={{
            fontSize: 16,
            backgroundColor: 'transparent',
            cursor: 'pointer',
            borderWidth: 1,
            borderColor: 'primary',
            borderStyle: 'solid',
            borderRadius: 3,
          }}
          onClick={() => inputRef.current.click()}>
          Select File
        </Button>
        <input
          ref={inputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
      </Box>
      <Box
        className="drop-indicator"
        sx={{
          display: dragging ? 'block' : 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 1,
          pointerEvents: 'none',
          borderWidth: 3,
          borderStyle: 'dashed',
          borderColor: 'primary',
        }}
      />
    </>
  )
}

export default FilePicker
