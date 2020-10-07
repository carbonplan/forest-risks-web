import { useState } from 'react'
import { Box, Text } from 'theme-ui'
import TimeSeries from './time-series'
import { allOptions, optionKey, plotRanges } from '@constants'

function getAverageForYear(points, key) {
  if (!points.length) return null

  const sum = points.reduce((_sum, point) => _sum + point.properties[key], 0)
  return sum / points.length
}

export default function Visualization({ data, options }) {
  const [mode, setMode] = useState(0)

  if (!data) return null

  const { region, points } = data

  const years = allOptions.years
  const types = Object.keys(points)

  const stats = {}
  types.forEach((type) => {
    const pointsForType = points[type]
    stats[type] = {
      count: pointsForType.length,
      averages: [],
    }
    years.forEach((year, index) => {
      const key = optionKey({
        model: options.model,
        scenario: options.scenario,
        year: year
      })
      stats[type].averages[index] = {
        x: year,
        y: getAverageForYear(pointsForType, key),
      }
    })
  })

  stats.fire.averages = stats.fire.averages.map((d) => {
    return {x: d.x, y: d.y * 100}
  })

  const biomass = stats.biomass.averages.map((d) => d.y)
  const biomassDelta = biomass.slice(1, biomass.length)
    .map((_,i) => (biomass[i+1] - biomass[i]))
    .reduce((a, b) => a + b, 0)

  const fire = stats.fire.averages.map((d) => d.y)
  const fireDelta = fire.slice(1, fire.length)
    .map((_,i) => (fire[i+1] - fire[i]))
    .reduce((a, b) => a + b, 0)

  const sx = {
    group: {
      p: [3], 
      position: 'relative',
      borderStyle: 'solid',
      borderWidth: '0px',
      borderBottomWidth: '1px',
      borderColor: 'muted',
    },
    label: {
      display: 'inline-block',
      fontFamily: 'heading',
      letterSpacing: 'wide',
      textTransform: 'uppercase',
      mb: [2],
      fontSize: [2],
    },
    number: {
      display: 'inline-block',
      float: 'right',
      fontFamily: 'monospace',
      letterSpacing: 'monospace',
      fontSize: [4],
      display: 'inline-block',
      ml: [3]
    },
    unit: {
      fontFamily: 'faux',
      display: 'inline-block',
      letterSpacing: 'faux',
      color: 'secondary',
      fontSize: [1],
      display: 'inline-block',
      ml: [2],
    },
  }

  const fireRange = plotRanges(options)['fire']
  const biomassRange = plotRanges(options)['biomass']

  return (
    <>
    {options['biomass'] && 
      <Box sx={sx.group}>
        <Box>
        <Text sx={sx.label}>Biomass</Text>
        <Text sx={sx.unit}>tCO2 / ha</Text>
        <Text sx={{...sx.number, color: 'green'}}>+{biomassDelta.toFixed(2)}</Text>
        </Box>
        <TimeSeries data={stats.biomass.averages} domain={[2020, 2100]} range={biomassRange} color={'green'}></TimeSeries>
      </Box>
    }
    {options['fire'] && 
      <Box sx={sx.group}>
        <Box>
        <Text sx={sx.label}>Risk</Text>
        <Text sx={{...sx.number, color: 'orange'}}>+{(fireDelta).toFixed(0)}%</Text>
        </Box>
        <TimeSeries data={stats.fire.averages} domain={[2020, 2100]} range={fireRange} color={'orange'}></TimeSeries>
      </Box>
    }
    </>
  )
}
