import { useState } from 'react'
import { Box, Text, Grid } from 'theme-ui'
import Donut from './donut'
import Histogram from './histogram'
import Info from '../info'
import { allOptions, optionKey, optionIndex } from '@constants'

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

  const biomassPoints = points['biomass']
  const biomassDeltas = biomassPoints.map((d) => {
    const key = optionIndex('scenarios', options.scenario)
    return d.properties[key + '_4'] - d.properties[key + '_0']
  })
  const maxBiomassDelta = biomassDeltas.reduce((a, b) => Math.max(a, b), 0)

  const nBins = 8
  const binWidth = maxBiomassDelta / 8
  const binEdges = Array(nBins + 1)
    .fill(0)
    .map((_, i) => i * binWidth)
  const counts = binEdges
    .map((b, i) => {
      return biomassDeltas.filter(
        (d) => (d >= binEdges[i]) & (d < binEdges[i + 1])
      ).length
    })
    .slice(0, nBins)
  const maxCount = counts.reduce((a, b) => Math.max(a, b), 0)
  const histogram = counts.map((d) => d / maxCount)

  const stats = {}
  types.forEach((type) => {
    const pointsForType = points[type]
    stats[type] = {
      count: pointsForType.length,
      averages: [],
    }
    years.forEach((year, index) => {
      const key = optionKey({
        scenario: options.scenario,
        year: year,
      })
      stats[type].averages[index] = {
        x: year,
        y: getAverageForYear(pointsForType, key),
      }
    })
  })

  const biomass = stats.biomass.averages.map((d) => d.y)
  const biomassDelta = biomass[4] - biomass[0]

  const key = optionIndex('years', options.year)

  // currently only using first year
  const fireTotal = stats.fire.averages.map((d) => d.y)[key]
  const droughtTotal = stats.drought.averages.map((d) => d.y)[key]
  const insectsTotal = stats.insects.averages.map((d) => d.y)[key]

  const sx = {
    group: {
      py: [4],
      pl: [0, 4, 5, 6],
      pr: [0, 5, 5, 6],
      position: 'relative',
      borderStyle: 'solid',
      borderWidth: '0px',
      borderBottomWidth: '1px',
      borderColor: 'muted',
    },
    label: {
      fontFamily: 'heading',
      letterSpacing: 'wide',
      textTransform: 'uppercase',
      mb: [2],
      fontSize: [2],
    },
    numberCenter: {
      fontFamily: 'mono',
      letterSpacing: 'mono',
      fontSize: ['18px'],
      display: 'inline-block',
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '90%',
      width: '100%',
    },
    numberLeft: {
      fontFamily: 'mono',
      letterSpacing: 'mono',
      fontSize: ['18px'],
      display: 'inline-block',
      ml: [0],
    },
    metric: {
      fontFamily: 'faux',
      display: 'inline-block',
      letterSpacing: 'faux',
      color: 'text',
      fontSize: [2],
      display: 'inline-block',
      ml: [2],
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
    explanation: {
      fontFamily: 'body',
      fontSize: [1],
      mt: [2],
      mb: [3],
    },
  }

  return (
    <>
      <Box sx={sx.group}>
        <Text sx={sx.label}>
          Risks
          <Info margin={3}>
            Fire, drought, and insects all limit forest carbon permanence.
            Scores here represent the average risk of each factor across the
            selected region, and the shaded fraction of the donut represents the
            fraction of plots where risk was above a 10% threshold. Risks are
            estimated over a 10 year period. Fire risk is the probability of at
            least one fire, and drought and insect risks are expected fractional
            loss in basal area.
          </Info>
        </Text>
        <Grid
          columns={[3]}
          gap={[0, 5, 5, 6]}
          sx={{
            mt: ['14px'],
            mb: ['26px'],
          }}
        >
          <Box sx={{ mt: [1], position: 'relative' }}>
            <Box sx={{ ...sx.numberCenter, color: 'orange' }}>
              {fireTotal ? fireTotal.toFixed(0) : 0}%
            </Box>
            <Donut data={fireTotal / 100} color={'orange'} />
            <Box
              sx={{
                ...sx.numberCenter,
                height: 'auto',
                mt: [2],
                fontSize: [1],
                color: 'orange',
              }}
            >
              FIRE
            </Box>
          </Box>
          <Box sx={{ mt: [1], position: 'relative' }}>
            <Box sx={{ ...sx.numberCenter, color: 'pink' }}>
              {Math.min(droughtTotal, 100).toFixed(0)}%
            </Box>
            <Donut data={droughtTotal / 100} color={'pink'} />
            <Box
              sx={{
                ...sx.numberCenter,
                height: 'auto',
                mt: [2],
                fontSize: [1],
                color: 'pink',
              }}
            >
              DROUGHT
            </Box>
          </Box>
          <Box sx={{ mt: [1], position: 'relative' }}>
            <Box sx={{ ...sx.numberCenter, color: 'blue' }}>
              {Math.min(insectsTotal, 100).toFixed(0)}%
            </Box>
            <Donut data={insectsTotal / 100} color={'blue'} />
            <Box
              sx={{
                ...sx.numberCenter,
                height: 'auto',
                mt: [2],
                fontSize: [1],
                color: 'blue',
              }}
            >
              INSECTS
            </Box>
          </Box>
        </Grid>
      </Box>
      <Box sx={sx.group}>
        <Box sx={sx.label}>
          Biomass
          <Info margin={'14px'}>
            The biomass map shows carbon capture potential from continued growth
            in current forests. The growth rate is from models trained on
            historical forests. The distribution of growth rates for the
            selected area is shown below.
          </Info>
        </Box>
        <Box sx={{ ...sx.numberLeft, color: 'green' }}>
          +{biomassDelta.toFixed(2) / 2}
        </Box>
        <Box sx={{ ...sx.unit, mb: [3] }}>tC / ha</Box>
        <Box sx={{ mb: ['28px'] }}>
          <Histogram values={histogram} />
          <Text
            sx={{
              float: 'left',
              fontSize: [1],
              fontFamily: 'mono',
              letterSpacing: 'mono',
              color: 'secondary',
              mt: [1],
            }}
          >
            LOW growth
          </Text>
          <Text
            sx={{
              float: 'right',
              fontSize: [1],
              fontFamily: 'mono',
              letterSpacing: 'mono',
              color: 'secondary',
              mt: [1],
            }}
          >
            HIGH growth
          </Text>
        </Box>
      </Box>
    </>
  )
}
