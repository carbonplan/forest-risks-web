import { useState } from 'react'
import { useThemeUI, Box, Slider, Text } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import { Tag } from '@carbonplan/components'
import Info from '../info'

function Layers({ options, setOptions, children }) {
  const {
    theme: { rawColors: colors },
  } = useThemeUI()
  const [sliderChanging, setSliderChanging] = useState(false)
  const [tick, setTick] = useState(false)

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

  const Option = ({ value, label, color, disabled }) => {
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
        {label || value}
      </Tag>
    )
  }

  const Radio = ({ name, value, label, color, disabled }) => {
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
        {label}
      </Tag>
    )
  }

  return (
    <Box>
      <Box sx={sx.group}>
        <Box sx={sx.label}>
          Forests
          <Info>
            As forests grow they capture carbon in the form of biomass. This map
            shows the carbon removal potential of continuing growth in existing
            forests. As such, it projects avoided deforestation as opposed to
            afforefation or reforestation.
          </Info>
        </Box>
        <Option value='biomass' color='green' />
      </Box>
      <Box sx={sx.group}>
        <Box sx={sx.label}>
          Risks
          <Info>
            Fire, drought, and insects all pose risks to forests and thus limit
            carbon permanence. As shown, fire risks are projected into the
            future using climate models. *Models for insect and drought risks
            remain in development so the map only displays historical mortality
            patterns for these risks.
          </Info>
        </Box>
        <Option value='fire' color='orange' />
        <Option value='drought' label='drought*' color='pink' />
        <Option value='insects' label='insects*' color='blue' />
      </Box>
      <Box sx={sx.group}>
        <Box sx={sx.label}>
          warming Scenarios
          <Info>
            The climate science community has devised multiple scenarios (Shared
            Socioeconomic Pathways or “SSPs”) of emissions and warming in the
            future. SSP2-4.5 represents an optimistic outlook (with lower
            emissions), SSP5-8.5 is pessimistic (with very high emissions), and
            SSP3-7.0 is in between.
          </Info>
        </Box>
        <Box>
          <Radio value='SSP2-4.5' label='low' name='scenario' color='primary' />
          <Radio
            value='SSP3-7.0'
            label='medium'
            name='scenario'
            color='primary'
          />
          <Radio
            value='SSP5-8.5'
            label='high'
            name='scenario'
            color='primary'
          />
        </Box>
      </Box>
      <Box sx={sx.group}>
        <Box sx={sx.label}>
          Year
          <Info margin={'22px'}>
            We fit models to the past and simulate future conditions through the
            21st century. Estimates are averaged within 20 year windows. Moving
            the slider reveals potential and risks in the near and far future.
            *Drought and insect risks are constant as models are still in
            development.
          </Info>
        </Box>
        <Box sx={{ mt: [3], mb: [3], mr: ['4px'] }}>
          <Slider
            type='range'
            sx={{
              width: '100%',
              '&::-webkit-slider-thumb': {
                height: [18, 18, 16],
                width: [18, 18, 16],
              },
              ':focus-visible': {
                outline: 'none !important',
                background: `${colors.secondary} !important`,
              },
              ':focus': {
                '&::-webkit-slider-thumb': {
                  boxShadow: `0 0 0 4px ${colors.secondary}`,
                },
              },
            }}
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
            onKeyDown={(e) => {
              if (tick) clearTimeout(tick)
              setSliderChanging(true)
              setTick(
                setTimeout(() => {
                  setSliderChanging(false)
                }, 250)
              )
            }}
            onKeyUp={(e) => setSlider('year', e.target.value)}
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
