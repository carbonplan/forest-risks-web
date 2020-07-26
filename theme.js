import base from '@carbonplan/theme'

const theme = {
  ...base,
  badges: {
    primary: {
      letterSpacing: 'wide',
      cursor: 'pointer',
      color: 'primary',
      borderStyle: 'solid',
      borderColor: 'primary',
      borderWidth: '0px',
      borderBottomWidth: '1px',
      bg: 'background',
      borderRadius: '0px',
      textTransform: 'uppercase',
      mb: [2],
      pt: ['1px'],
      pb: ['2px'],
      pl: [0],
      pr: [0],
      fontSize: [1],
      fontFamily: 'monospace',
    },
  },
  buttons: {
    icon: {
      fill: 'background',
      stroke: 'secondary',
      cursor: 'pointer',
      transition: '0.25s all',
      '&:hover': {
        stroke: 'text',
      },
    },
  },
}

export default theme
