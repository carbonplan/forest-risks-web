import { useState } from 'react'
import { Box, Slider, Text } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import { Tag } from '@carbonplan/components'
import Info from '../info'

function Layers({ options, setOptions, children }) {
  const [sliderChanging, setSliderChanging] = useState(false)

  const sx = {
    group: {
      pt: [4],
      pb: ['22px'],
      px: [3, 4, 5, 6],
      borderStyle: 'solid',
      borderColor: 'muted',
      borderWidth: '0px',
      borderBottomWidth: '1px',
      width: '100%',
    },
    groupFinal: {
      py: [4],
      px: [5],
      borderStyle: 'solid',
      borderColor: 'muted',
      borderWidth: '0px',
      borderTopWidth: '1px',
      width: '100%',
      position: 'absolute',
      bottom: 0,
    },
    label: {
      fontSize: [2, 2, 2, 3],
      fontFamily: 'heading',
      letterSpacing: 'smallcaps',
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

  function setSlider(name, value) {
    setOptions((options) => {
      return { ...options, [name]: value }
    })
  }

  const Option = ({ value, color, disabled }) => {
    return (
      <Tag
        onClick={() => toggleOption(value)}
        sx={{
          mr: [3],
          mb: [2],
          color: options[value] & !disabled ? color : alpha(color, 0.2),
          borderColor: options[value] & !disabled ? color : alpha(color, 0.2),
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        {value}
      </Tag>
    )
  }

  const Radio = ({ name, value, color, disabled }) => {
    return (
      <Tag
        onClick={() => toggleRadio(name, value)}
        sx={{
          mr: [3],
          mb: [2],
          color:
            (options[name] == value) & !disabled ? color : alpha(color, 0.2),
          borderColor:
            (options[name] == value) & !disabled ? color : alpha(color, 0.2),
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        {value}
      </Tag>
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
        <Box sx={sx.label}>
          Forests
          <Info>
            As forests grow they capture carbon in the form of biomass. This map
            shows the carbon removal potential of continuing growth in existing
            forests. It is more similar to an avoided deforestation scenario, as
            opposed to afforefation or reforestation.
          </Info>
        </Box>
        <Option value='biomass' color='green' />
      </Box>
      <Box sx={sx.group}>
        <Box sx={sx.label}>
          Risks
          <Info>
            Fire, drought, and insects all pose risks to forests and thus limit
            carbon permanence. There is also a biophysical warming effect due to
            trees absorbing light. Toggling each of these factors reveals
            competing and compounding risks.
          </Info>
        </Box>
        <Option value='fire' color='orange' />
        <Option value='drought' color='pink' />
        <Option value='insects' color='blue' />
      </Box>
      <Box sx={sx.group}>
        <Box sx={sx.label}>
          Scenarios
          <Info>
            The climate science community devises multiple scenarios (Shared
            Socioeconomic Pathways or “SSPs”) of emissions and warming for the
            future. SSP2-4.5 represents an optimistic outlook, SSP5-8.5 is
            pessimistic, and SSP3-7.0 is in between.
          </Info>
        </Box>
        <Box>
          <Radio value='SSP2-4.5' name='scenario' color='primary' />
          <Radio value='SSP3-7.0' name='scenario' color='primary' />
          <Radio value='SSP5-8.5' name='scenario' color='primary' />
        </Box>
      </Box>
      <Box sx={sx.group}>
        <Box sx={sx.label}>
          Time
          <Info margin={'22px'}>
            We fit models to the past and then simulated future conditions from
            2020 through 2100. Moving the slider reveals benefits and risks in
            the near and far future.
          </Info>
        </Box>
        <Box sx={{mt: [3], mb: [3], mr: ['4px']}}>
        <Slider
          sx={{ width: '100%' }}
          value={parseFloat(options['displayYear'])}
          onMouseUp={(e) => {
            setSlider('year', e.target.value)
            setSlider('displayYear', e.target.value)
            setSliderChanging(false)
          }}
          onChange={(e) => setSlider('displayYear', e.target.value)}
          onMouseDown={() => {
            setSliderChanging(true)
          }}
          min={2010}
          max={2090}
          step={10}
        />
        </Box>
        <Box
          sx={{
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              fontFamily: 'mono',
              letterSpacing: 'mono',
              fontSize: [1],
              display: 'inline-block',
              float: 'left',
            }}
          >
            2010
          </Box>
          <Box
            sx={{
              fontFamily: 'mono',
              letterSpacing: 'mono',
              display: 'inline-block',
              fontSize: [1],
              ml: 'auto',
              mr: 'auto',
              color: 'secondary',
              opacity: sliderChanging ? 1 : 0,
              transition: '0.2s',
            }}
          >
            {options.displayYear}
          </Box>
          <Box
            sx={{
              fontFamily: 'mono',
              letterSpacing: 'mono',
              fontSize: [1],
              float: 'right',
              display: 'inline-block',
              mr: ['4px'],
            }}
          >
            2090
          </Box>
        </Box>
      </Box>
      {children}
    </Box>
  )
}

export default Layers
