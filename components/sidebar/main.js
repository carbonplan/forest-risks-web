import { Box, Slider, Badge, Text } from 'theme-ui'
import { alpha } from '@theme-ui/color'

function Main({ options, setOptions, children }) {
  const sx = {
    group: {
      p: [3],
      borderStyle: 'solid',
      borderColor: 'muted',
      borderWidth: '0px',
      borderBottomWidth: '1px',
      width: '100%',
    },
    groupFinal: {
      p: [3],
      borderStyle: 'solid',
      borderColor: 'muted',
      borderWidth: '0px',
      borderTopWidth: '1px',
      width: '100%',
      position: 'absolute',
      bottom: 0,
    },
    label: {
      fontFamily: 'heading',
      letterSpacing: 'wide',
      textTransform: 'uppercase',
      mb: [2],
    },
    sublabel: {
      display: 'inline-block',
      color: 'primary',
      fontFamily: 'faux',
      letterSpacing: 'faux',
    },
    arrow: {
      display: 'inline-block',
      color: 'primary',
      fontFamily: 'faux',
      letterSpacing: 'faux',
      mr: [2],
      verticalAlign: 'middle',
    },
  }

  function toggleOption(value) {
    setOptions((options) => {
      return { ...options, [value]: !options[value] }
    })
  }

  function toggleRadio(name, value) {
    setOptions((options) => {
      return { ...options, [name]: value }
    })
  }

  function setYear(value) {
    setOptions((options) => {
      return { ...options, ['year']: value }
    })
  }

  const Option = ({ value, color, disabled }) => {
    return (
      <Badge
        variant='primary'
        onClick={() => toggleOption(value)}
        sx={{
          mr: [3],
          color: options[value] & !disabled ? color : alpha(color, 0.2),
          borderColor: options[value] & !disabled ? color : alpha(color, 0.2),
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        {value}
      </Badge>
    )
  }

  const Radio = ({ name, value, color, disabled }) => {
    return (
      <Badge
        variant='primary'
        onClick={() => toggleRadio(name, value)}
        sx={{
          mr: [3],
          color:
            (options[name] == value) & !disabled ? color : alpha(color, 0.2),
          borderColor:
            (options[name] == value) & !disabled ? color : alpha(color, 0.2),
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        {value}
      </Badge>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={sx.group}>
        <Text sx={sx.label}>FORESTS</Text>
        <Option value='biomass' color='green' />
      </Box>
      <Box sx={sx.group}>
        <Text sx={sx.label}>Risks</Text>
        <Option value='fire' color='orange' />
        <Option value='drought' color='blue' disabled={true} />
        <Option value='insects' color='pink' disabled={true} />
      </Box>
      <Box sx={sx.group}>
        <Text sx={sx.label}>Climate</Text>
        <Box>
          <Radio value='SSP4.5' name='scenario' color='primary' />
          <Radio value='SSP7.0' name='scenario' color='primary' />
          <Radio value='SSP8.5' name='scenario' color='primary' />
          <Text sx={sx.arrow}>←</Text>
          <Text sx={sx.sublabel}>scenario</Text>
        </Box>
        <Box>
          <Radio value='BCC-CSM2-MR' name='model' color='primary' />
          <Text sx={sx.arrow}>←</Text>
          <Text sx={sx.sublabel}>model</Text>
        </Box>
      </Box>
      <Box sx={sx.group}>
        <Text sx={sx.label}>Time</Text>
        <Slider
          sx={{ mt: [3], mb: [3], fg: 'green' }}
          value={parseFloat(options['year'])}
          onChange={(e) => setYear(e.target.value)}
          min={2020}
          max={2100}
          step={20}
        />
        <Text sx={{ fontFamily: 'monospace', display: 'inline-block' }}>
          2020
        </Text>
        <Text
          sx={{
            fontFamily: 'monospace',
            float: 'right',
            display: 'inline-block',
          }}
        >
          2100
        </Text>
      </Box>
      {children}
    </Box>
  )
}

export default Main
