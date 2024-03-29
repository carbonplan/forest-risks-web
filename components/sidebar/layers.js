import { useState, useEffect } from 'react'
import { useThemeUI, Box, Text } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import { Tag, Slider } from '@carbonplan/components'
import Info from '../info'

function Layers({ options, setOptions, children }) {
  const {
    theme: { rawColors: colors },
  } = useThemeUI()
  const [sliderChanging, setSliderChanging] = useState(false)
  const [displayYear, setDisplayYear] = useState(options.year)
  const [tick, setTick] = useState(false)

  const sx = {
    group: {
      pt: [0, 4, 4, 4],
      pb: [5, '22px', '22px', '22px'],
      pl: [0, 4, 5, 6],
      pr: [0, 5, 5, 6],
      borderStyle: 'solid',
      borderColor: 'muted',
      borderWidth: '0px',
      borderBottomWidth: [0, '1px', '1px', '1px'],
      width: '100%',
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
    <>
      <Box sx={sx.group}>
        <Box sx={sx.label}>
          Forests
          <Info>
            As forests grow they capture carbon in the form of biomass. This map
            shows the carbon removal potential of continuing growth in existing
            forests. As such, it projects avoided deforestation as opposed to
            afforestation or reforestation.
          </Info>
        </Box>
        <Option value='biomass' color='green' />
      </Box>
      <Box sx={sx.group}>
        <Box sx={sx.label}>
          Risks
          <Info>
            Fire, drought, and insects all pose risks to forests and thus limit
            carbon permanence. Risks are projected into the future using climate
            models. These models have several assumptions and caveats, so future
            projections should be interpreted with care.
          </Info>
        </Box>
        <Option value='fire' color='orange' />
        <Option value='drought' label='drought' color='pink' />
        <Option value='insects' label='insects' color='blue' />
      </Box>
      <Box sx={sx.group}>
        <Box sx={sx.label}>
          warming Scenarios
          <Info>
            The climate science community has devised multiple scenarios (Shared
            Socioeconomic Pathways or “SSPs”) of emissions and warming in the
            future. SSP2-4.5 or "Low" represents an optimistic outlook with
            lower emissions, SSP5-8.5 or "High" is pessimistic with very high
            emissions, and SSP3-7.0 or "Medium" is in between.
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
        <Box sx={{ mt: [3], mb: [3], mr: [0, 0, 0, 0] }}>
          <Slider
            type='range'
            value={parseFloat(displayYear)}
            onMouseUp={(e) => {
              setSlider('year', e.target.value)
              setDisplayYear(e.target.value)
              setSliderChanging(false)
            }}
            onTouchEnd={(e) => {
              setSlider('year', e.target.value)
              setDisplayYear(e.target.value)
              setSliderChanging(false)
            }}
            onChange={(e) => setDisplayYear(e.target.value)}
            onTouchStart={() => {
              setSliderChanging(true)
            }}
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
              fontSize: [1, 1, 1, 2],
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
              fontSize: [1, 1, 1, 2],
              ml: 'auto',
              mr: 'auto',
              color: 'secondary',
              opacity: sliderChanging ? 1 : 0,
              transition: '0.2s',
            }}
          >
            {displayYear}
          </Box>
          <Box
            sx={{
              fontFamily: 'mono',
              letterSpacing: 'mono',
              fontSize: [1, 1, 1, 2],
              float: 'right',
              display: 'inline-block',
              mr: ['0px'],
            }}
          >
            2090
          </Box>
        </Box>
      </Box>
      {children}
    </>
  )
}

export default Layers
