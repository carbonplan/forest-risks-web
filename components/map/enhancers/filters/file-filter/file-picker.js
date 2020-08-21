import { useRef, useEffect, useState } from 'react'
import { Box, Button } from 'theme-ui'
import { Instructions, Section } from '../instructions'

function FilePicker({ map, onFile, clearable, onClear }) {
  const dropArea = useRef(null)
  const fileInput = useRef(null)

  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const listeners = []

    const listen = (element, eventName, func) => {
      element.addEventListener(eventName, func)
      listeners.push([element, eventName, func])
    }

    const trap = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    listen(map.getContainer(), 'dragenter', (e) => {
      trap(e)
      setDragging(true)
    })

    listen(dropArea.current, 'drop', (e) => {
      trap(e)
      handleFile(e.dataTransfer.files[0])
      setDragging(false)
    })

    listen(dropArea.current, 'dragleave', (e) => {
      trap(e)
      setDragging(false)
    })

    listen(dropArea.current, 'dragover', trap)

    return function cleanup() {
      listeners.forEach(([element, eventName, func]) => {
        element.removeEventListener(eventName, func)
      })
    }
  }, [])

  const handleFile = file => {
    if (!(file instanceof Blob)) {
      alert('could not open file')
      return
    }

    if (clearable) onClear()

    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = (readerEvent) => {
      onFile({
        filename: file.name,
        content: readerEvent.target.result
      })
      fileInput.current.value = ''
    }
  }

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText()
    onFile({
      filename: 'clipboard',
      content: text,
    })
  }

  return (
    <>
      <Box
        ref={dropArea}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 1000,
          pointerEvents: dragging ? 'auto' : 'none',
          borderWidth: dragging ? 4 : 0,
          borderStyle: 'dashed',
          borderColor: 'primary',
        }}
      />
      <input
        ref={fileInput}
        type="file"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />
      <Instructions>
        <Section>
          <Box>drag geojson file onto map</Box>
          <Box sx={{ marginY: '8px' }}>OR</Box>
          <Button onClick={() => fileInput.current.click()}>
            select file from hard drive
          </Button>
          <Box sx={{ marginY: '8px' }}>OR</Box>
          <Button onClick={handlePaste}>
            paste geojson from clipboard
          </Button>
        </Section>
        {clearable && (
          <Section sx={{ padding: '2px' }}>
            <Button onClick={onClear}>
              clear
            </Button>
          </Section>
        )}
      </Instructions>
    </>
  )
}

export default FilePicker
