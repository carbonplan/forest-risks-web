import { IconButton } from 'theme-ui'

const DrawButton = ({ onClick }) => (
  <IconButton
    aria-label='Toggle drawing'
    onClick={onClick}
    sx={{
      position: 'absolute',
      bottom: 48,
      left: 12,
      zIndex: 1,
    }}
  >
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='24'
      height='24'
      strokeWidth='1.75'
      fill='none'
    >
      <circle cx='12' cy='12' r='10' />
      <line x1='6' x2='18' y1='12' y2='12' />
      <line x1='12' x2='12' y1='6' y2='18' />
    </svg>
  </IconButton>
)

export default DrawButton
