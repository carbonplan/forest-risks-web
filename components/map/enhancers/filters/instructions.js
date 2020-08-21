import { Box } from 'theme-ui'

export function Instructions({ sx, children }) {
  return (
    <Box
      className='instructions'
      sx={{
        fontFamily: 'faux',
        fontSize: 16,
        position: 'absolute',
        top: 34,
        left: 16,
        textAlign: 'center',
        zIndex: 2,
        ...sx,
        button: {
          color: 'text',
          fontFamily: 'faux',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          borderWidth: 0,
          borderColor: 'primary',
          borderStyle: 'solid',
          borderRadius: 3,
          textDecoration: 'underline',
          padding: 0,
          marginBottom: '2px',
        },
      }}
    >
      {children}
    </Box>
  )
}

export function Section({ sx, children }) {
  return (
    <Box
      className='instructions-section'
      sx={{
        borderWidth: 2,
        borderColor: 'primary',
        borderStyle: 'solid',
        borderRadius: 5,
        backgroundColor: 'background',
        padding: 14,
        cursor: 'default',
        '&:not(:last-child)': {
          marginBottom: '8px',
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}
