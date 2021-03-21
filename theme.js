import base from '@carbonplan/theme'

const theme = {
  ...base,
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
