import { useState } from 'react'
import { Box, Slider, Badge, Text } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import Question from '../question'

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
        <Text sx={sx.label}>
          Forests
          <Question>
            As forests grow they capture carbon in the form of biomass. This map
            shows the carbon removal potential of continuing growth in existing
            forests. It is more similar to an avoided deforestation scenario, as
            opposed to afforefation or reforestation.
          </Question>
        </Text>
        <Option value='biomass' color='green' />
      </Box>
      <Box sx={sx.group}>
        <Text sx={sx.label}>
          Risks
          <Question>
            Fire, drought, and insects all pose risks to forests and thus limit
            carbon permanence. There is also a biophysical warming effect due to
            trees absorbing light. Toggling each of these factors reveals
            competing and compounding risks.
          </Question>
        </Text>
        <Option value='fire' color='orange' />
        <Option value='drought' color='pink' />
        <Option value='insects' color='blue' />
        <Option value='biophysical' color='grey' />
      </Box>
      <Box sx={sx.group}>
        <Text sx={sx.label}>
          Scenarios
          <Question>
            The climate science community devises multiple scenarios (Shared
            Socioeconomic Pathways or “SSPs”) of emissions and warming for the
            future. SSP2-4.5 represents an optimistic outlook, SSP5-8.5 is
            pessimistic, and SSP3-7.0 is in between.
          </Question>
        </Text>
        <Box>
          <Radio value='SSP2-4.5' name='scenario' color='primary' />
          <Radio value='SSP3-7.0' name='scenario' color='primary' />
          <Radio value='SSP5-8.5' name='scenario' color='primary' />
        </Box>
      </Box>
      <Box sx={sx.group}>
        <Text sx={sx.label}>
          Time
          <Question margin={'22px'}>
            We fit models to the past and then simulated future conditions from
            2020 through 2100. Moving the slider reveals benefits and risks in
            the near and far future.
          </Question>
        </Text>
        <Slider
          sx={{ mt: [3], mb: [3] }}
          value={parseFloat(options['year'])}
          onChange={(e) => setYear(e.target.value)}
          min={2020}
          max={2100}
          step={20}
        />
        <Text
          sx={{
            fontFamily: 'monospace',
            fontSize: [2],
            display: 'inline-block',
          }}
        >
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
