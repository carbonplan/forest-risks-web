import { IconButton } from 'theme-ui'

const Button = ({ svg, onClick, sx, active }) => (
  <IconButton
    aria-label='Toggle drawing'
    onClick={onClick}
    sx={sx}
  >
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='24'
      height='24'
      strokeWidth='1.75'
      fill={active ? 'cyan' : 'none'}
    >
      <circle cx='12' cy='12' r='10' />
      { svg }
    </svg>
  </IconButton>
)

export default Button
