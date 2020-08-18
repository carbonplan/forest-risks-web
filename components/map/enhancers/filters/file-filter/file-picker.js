import { useRef, useEffect, useState } from 'react'
import { Box, Button } from 'theme-ui'
import Instructions from '../instructions'

function FilePicker({ map, onFile = () => {} }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = file => {
    if (!(file instanceof Blob)) return

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
      <Instructions>
        <Box>drag geojson file onto map</Box>
        <Box sx={{ marginTop: 12 }}>OR</Box>
        <Button
          sx={{
            color: 'text',
            fontSize: 18,
            fontFamily: 'faux',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            borderWidth: 0,
            borderColor: 'primary',
            borderStyle: 'solid',
            borderRadius: 3,
            textDecoration: 'underline',
          }}
          onClick={() => inputRef.current.click()}>
          select file from hard drive
        </Button>
        <input
          ref={inputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
      </Instructions>
      {dragging && (
        <Box
          className="drop-indicator"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 1,
            pointerEvents: 'none',
            borderWidth: 4,
            borderStyle: 'dashed',
            borderColor: 'primary',
          }}
        />
      )}
    </>
  )
}

export default FilePicker
