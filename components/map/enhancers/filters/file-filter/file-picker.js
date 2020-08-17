import { useRef } from 'react'
import { Box, Button } from 'theme-ui'

function FilePicker({ onFile }) {
  const inputRef = useRef(null)

  const onChange = (e) => {
    const file = e.target.files[0]

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

      onFile({
        filename: file.name,
        content
      })
    }
  }

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
        borderStyle: 'solid',
        borderRadius: 5,
        backgroundColor: 'background',
        padding: 10,
        textAlign: 'center'
      }}
    >
      <Box sx={{ marginBottom: 10 }}>Drag GeoJson Here</Box>
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
        onChange={onChange}
      />
    </Box>
  )
}

export default FilePicker
