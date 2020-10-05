import { Box, Slider, Badge, Text } from 'theme-ui'
import { alpha } from '@theme-ui/color'

function Main({ options, setOptions, children }) {
  const sx = {
    group: {
      pl: [3],
      pr: [3],
      pt: [3],
      pb: [3],
      borderStyle: 'solid',
      borderColor: 'muted',
      borderWidth: '0px',
      borderBottomWidth: '1px',
      width: '100%',
    },
    groupFinal: {
      pl: [3],
      pr: [3],
      pt: [3],
      pb: [3],
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

  function toggleOption(name) {
    setOptions((options) => {
      return { ...options, [name]: !options[name] }
    })
  }

  function setYear(value) {
    setOptions((options) => {
      return { ...options, ['year']: value }
    })
  }

  const Option = ({ label, color, disabled }) => {
    return (
      <Badge
        variant='primary'
        onClick={() => toggleOption(label)}
        sx={{
          mr: [3],
          color: options[label] & !disabled ? color : alpha(color, 0.2),
          borderColor: options[label] & !disabled ? color : alpha(color, 0.2),
        }}
      >
        {label}
      </Badge>
    )
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={sx.group}>
        <Text sx={sx.label}>FORESTS</Text>
        <Option label='biomass' color='green' />
      </Box>
      <Box sx={sx.group}>
        <Text sx={sx.label}>Risks</Text>
        <Option label='fire' color='orange' />
        <Option label='drought' color='blue' disabled={true} />
        <Option label='insects' color='pink' disabled={true} />
      </Box>
      <Box sx={sx.group}>
        <Text sx={sx.label}>Climate</Text>
        <Box>
          <Option label='SSP4.5' color='primary' />
          <Option label='SSP7.0' color='primary' />
          <Option label='SSP8.5' color='primary' />
          <Text sx={sx.arrow}>←</Text>
          <Text sx={sx.sublabel}>scenario</Text>
        </Box>
        <Box>
          <Option label='CCSM' color='primary' />
          <Text sx={sx.arrow}>←</Text>
          <Text sx={sx.sublabel}>model</Text>
        </Box>
      </Box>
      <Box sx={sx.group}>
        <Text sx={sx.label}>Time</Text>
        <Slider
          sx={{ mt: [3], mb: [3], fg: 'green' }}
          value={options['year']}
          onChange={(e) => setYear(parseFloat(e.target.value))}
          min={2000}
          max={2100}
          step={10}
        />
        <Text sx={{ fontFamily: 'monospace', display: 'inline-block' }}>
          2000
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
