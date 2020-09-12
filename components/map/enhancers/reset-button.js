import { IconButton } from 'theme-ui'

const ResetButton = ({ onClick }) => {
  return (
    <IconButton aria-label='Recenter map' onClick={onClick}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        width='24'
        height='24'
        strokeWidth='1.75'
        fill='none'
      >
        <circle cx='12' cy='12' r='10' />
        <circle cx='12' cy='12' r='2' />
      </svg>
    </IconButton>
  )
}

export default ResetButton
