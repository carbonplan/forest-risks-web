import { Box, Slider } from 'theme-ui'

const RadiusSlider = ({ value, onChange, onIdle }) => (
  <Box
    sx={{
      position: 'absolute',
      zIndex: 1,
      bottom: 18,
      left: 85,
      width: 300,
      display: 'flex',
    }}
  >
    <Slider
      min={0}
      max={1000}
      style={{ flex: 1 }}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      onMouseUp={(e) => onIdle(Number(e.target.value))}
    />
  </Box>
)

export default RadiusSlider
