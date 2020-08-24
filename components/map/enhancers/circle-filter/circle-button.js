import { IconButton } from 'theme-ui'

const CircleButton = ({ onClick }) => (
  <IconButton
    aria-label='Toggle circle picker'
    onClick={onClick}
    sx={{
      position: 'absolute',
      bottom: 12,
      left: 50,
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
      <circle cx='10' cy='10' r='3' />
      <line x1='12' x2='17' y1='12' y2='17' />
    </svg>
  </IconButton>
)

export default CircleButton
