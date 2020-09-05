import { IconButton } from 'theme-ui'

const ResetButton = ({ onClick, sx }) => {
  return (
    <IconButton aria-label='Recenter map' onClick={onClick} sx={sx}>
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
        <line x1='13' x2='18' y1='6' y2='12' />
        <line x1='13' x2='18' y1='18' y2='12' />
      </svg>
    </IconButton>
  )
}

export default ResetButton
