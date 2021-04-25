import { Box, IconButton } from 'theme-ui'

const Button = ({ svg, onClick, sx, active, label }) => (
  <IconButton
    aria-label={label}
    onClick={onClick}
    sx={{ ...sx, ...{ stroke: active ? 'primary' : 'secondary' } }}
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
      {svg}
    </svg>
  </IconButton>
)

export default Button
