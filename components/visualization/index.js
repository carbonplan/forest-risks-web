import { useState } from 'react'
import { Box, Text } from 'theme-ui'
import TimeSeries from './time-series'

function getAverageForYear(points, year) {
  if (!points.length) return null

  const sum = points.reduce((_sum, point) => _sum + point.properties[year], 0)
  return sum / points.length
}

export default function Visualization({ data }) {
  const [mode, setMode] = useState(0)

  if (!data) return null

  const { region, points } = data

  const years = Array(11)
    .fill(0)
    .map((_, i) => i * 10 + 2000)
  const types = Object.keys(points)

  const stats = {}
  types.forEach((type) => {
    const pointsForType = points[type]
    stats[type] = {
      count: pointsForType.length,
      averages: [],
    }
    years.forEach((year, index) => {
      stats[type].averages[index] = {
        year: year,
        biomass: getAverageForYear(pointsForType, year),
      }
    })
  })

  console.log(stats.forests.averages)
  const init = stats.forests.averages[0].biomass
  const delta = stats.forests.averages
    .map((d) => d.biomass - init)
    .reduce((a, b) => a + b, 0)

  const sx = {
    label: {
      fontFamily: 'heading',
      letterSpacing: 'wide',
      textTransform: 'uppercase',
      mb: [2],
    },
    number: {
      fontFamily: 'faux',
      letterSpacing: 'faux',
      color: 'green',
      fontSize: [4],
      display: 'inline-block',
    },
    unit: {
      fontFamily: 'faux',
      letterSpacing: 'faux',
      color: 'secondary',
      fontSize: [2],
      display: 'inline-block',
      ml: [2],
    },
  }

  return (
    <Box sx={{ flex: 1, padding: 16, position: 'relative' }}>
      <Text sx={sx.label}>Biomass</Text>
      <Text sx={sx.number}>{delta.toFixed(2)}</Text>
      <Text sx={sx.unit}>tCO2 / ha</Text>
      <TimeSeries data={stats.forests.averages}></TimeSeries>
    </Box>
  )
}
