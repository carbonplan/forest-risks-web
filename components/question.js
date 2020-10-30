import { useState } from 'react'
import { Text, IconButton } from 'theme-ui'

const Question = ({ children }) => {
  const [expanded, setExpanded] = useState(false)
  const toggle = (e) => {setExpanded(!expanded)}

  const sx = {
    body: {
      ontFamily: 'body',
      letterSpacing: 'body',
      textTransform: 'none',
      fontFamily: 'body',
      fontSize: [1],
      mt: [1],
      mb: [2],
    },
  }

  return (
    <>
      <IconButton
        onClick={toggle}
        aria-label='Toggle more info'
        sx={{
          cursor: 'pointer',
          color: expanded ? 'text' : 'muted',
          display: 'inline-block',
          '&:hover': {
            color: 'text',
          },
          p: [0],
        }}
      >
        <Text sx={{
          fontSize: expanded ? [2] : [2],
        }}>
          {expanded ? '?' : '?'}
        </Text>
      </IconButton>
      {expanded && <Text sx={sx.body}>
        {children}
      </Text>
      }
    </>
  )
}

export default Question
