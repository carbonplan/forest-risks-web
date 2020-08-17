import { Box } from 'theme-ui'

export default function Instructions({ children }) {
  return (
    <Box
      sx={{
        fontFamily: 'faux',
        fontSize: 18,
        position: 'absolute',
        top: 34,
        left: 16,
        borderWidth: 2,
        borderColor: 'primary',
        borderStyle: 'solid',
        borderRadius: 5,
        backgroundColor: 'background',
        padding: 14,
        textAlign: 'center'
      }}
    >
      { children }
    </Box>
  )
}
