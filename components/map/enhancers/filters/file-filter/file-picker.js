import { useRef, useEffect, useState } from 'react'
import { Box, Button } from 'theme-ui'

function FilePicker({ onFile }) {
  const inputRef = useRef(null)
  const dropRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = file => {
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = (readerEvent) => {
      let content = readerEvent.target.result

      try {
        content = JSON.parse(content)
      } catch (e) {
        console.log('parse error:', e)
        return
      }

      onFile({ filename: file.name, content })
    }
  }

  useEffect(() => {
    dropRef.current.addEventListener('drop', (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log(e.dataTransfer.files)
      handleFile(e.dataTransfer.files[0])
      setDragging(false)
    })

    dropRef.current.addEventListener('dragenter', (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragging(true)
    })

    dropRef.current.addEventListener('dragleave', (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragging(false)
    })

    dropRef.current.addEventListener('dragover', (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
  }, [])

  return (
    <Box
      sx={{
        fontFamily: 'faux',
        fontSize: 20,
        position: 'absolute',
        top: 50,
        left: 12,
        borderWidth: 2,
        borderColor: 'primary',
        borderStyle: dragging ? 'dotted' : 'solid',
        borderRadius: 5,
        backgroundColor: 'background',
        padding: 10,
        textAlign: 'center'
      }}
    >
      <Box ref={dropRef} sx={{ marginBottom: 10 }}>Drag GeoJson Here</Box>
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
  )
}

export default FilePicker
