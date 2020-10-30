/** @jsx jsx */
import { useState } from 'react'
import { jsx, Box, Text, Grid } from 'theme-ui'
import TimeSeries from './time-series'
import Donut from './donut'
import Question from '../question'
import { allOptions, optionKey, optionIndex, plotRanges } from '@constants'
import * as d3 from 'd3'

function getAverageForYear(points, key) {
  if (!points.length) return null

  const sum = points.reduce((_sum, point) => _sum + point.properties[key], 0)
  return sum / points.length
}

const Histogram = ({ scales, values }) => {
  const width = 315
  const height = 63
  const y = d3.scaleLinear().domain([0, 1]).range([0, height])
  return (
    <svg width={width} height={height}>
      {values.map((d, i) => {
        return (
          <g transform={`translate(${i * 40})`} key={i}>
            <rect
              sx={{
                fill: 'green',
                opacity: 0.2,
              }}
              width={32}
              height={y(1)}
            ></rect>
            {!isNaN(d) && (
              <rect
                sx={{
                  fill: 'green',
                  opacity: 1,
                }}
                width={32}
                height={y(d)}
                transform={`translate(0, ${height - y(d)})`}
              ></rect>
            )}
          </g>
        )
      })}
    </svg>
  )
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

  const fireTotal = stats.fire.averages.map((d) => d.y)[key]
  const fireFraction =
    points['fire']
      .map((d) => {
        const key = optionKey({
          scenario: options.scenario,
          year: options.year,
        })
        if (d.properties[key] > 0.02) return 1
        else return 0
      })
      .reduce((a, b) => a + b, 0) / points['fire'].length

  const droughtTotal = stats.drought.averages.map((d) => d.y)[key]
  const droughtFraction =
    points['drought']
      .map((d) => {
        const key = optionKey({
          scenario: options.scenario,
          year: options.year,
        })
        if (d.properties[key] > 0.1) return 1
        else return 0
      })
      .reduce((a, b) => a + b, 0) / points['drought'].length

  const insectsTotal = stats.insects.averages.map((d) => d.y)[key]
  const insectsFraction =
    points['insects']
      .map((d) => {
        const key = optionKey({
          scenario: options.scenario,
          year: options.year,
        })
        if (d.properties[key] > 0.1) return 1
        else return 0
      })
      .reduce((a, b) => a + b, 0) / points['insects'].length

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
      fontFamily: 'heading',
      letterSpacing: 'wide',
      textTransform: 'uppercase',
      mb: [2],
      fontSize: [2],
    },
    numberCenter: {
      fontFamily: 'monospace',
      letterSpacing: 'monospace',
      fontSize: [4],
      display: 'inline-block',
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      top: '28px',
      width: '100%',
    },
    numberLeft: {
      fontFamily: 'monospace',
      letterSpacing: 'monospace',
      fontSize: [4],
      display: 'inline-block',
      ml: [0],
    },
    numberRight: {
      display: 'inline-block',
      float: 'right',
      fontFamily: 'monospace',
      letterSpacing: 'monospace',
      fontSize: [4],
      display: 'inline-block',
      marginTop: '-2px',
      ml: [3],
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
    <Box>
      <Box sx={sx.group}>
        <Text sx={sx.label}>
          Biomass
          <Question>
            The biomass map shows carbon capture potential from continued
            growth in current forests. The growth rate is from models trained on
            historical forests. The distribution of growth rates for the selected
            area is shown below.
          </Question>
        </Text>
        <Text sx={{ ...sx.numberLeft, color: 'green' }}>
          +{biomassDelta.toFixed(2)}
        </Text>
        <Text sx={{ ...sx.unit, mb: [3] }}>t / ha</Text>
        <Box sx={{ mb: ['28px'] }}>
          <Histogram values={histogram} />
          <Text
            sx={{
              float: 'left',
              fontSize: [1],
              fontFamily: 'monospace',
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
              fontFamily: 'monospace',
              color: 'secondary',
              mt: [1],
            }}
          >
            HIGH growth
          </Text>
        </Box>
      </Box>
      <Box sx={sx.group}>
        <Text sx={sx.label}>
          Risks
          <Question>
            Fire, drought, and insects are all risk factors to tree mortality,
            thus threatening forest carbon permanence. Scores here represent the
            average risk of each factor across the selected region, and the shaded
            fraction of the donut represents the fraction of plots where risk was
            above a threshold.
          </Question>
        </Text>
        <Grid sx={{ mb: ['26px'] }} columns={[3]}>
          <Box sx={{ mt: [2], position: 'relative' }}>
            <Text sx={{ ...sx.numberCenter, color: 'orange' }}>
              {(fireTotal * 100).toFixed(0)}%
            </Text>
            <Donut data={fireFraction} color={'orange'} />
            <Text
              sx={{
                ...sx.numberCenter,
                top: '98px',
                fontSize: [1],
                color: 'orange',
              }}
            >
              FIRE
            </Text>
          </Box>
          <Box sx={{ mt: [2], position: 'relative' }}>
            <Text sx={{ ...sx.numberCenter, color: 'pink' }}>
              {(droughtTotal * 100).toFixed(0)}%
            </Text>
            <Donut data={droughtFraction} color={'pink'} />
            <Text
              sx={{
                ...sx.numberCenter,
                top: '98px',
                fontSize: [1],
                color: 'pink',
              }}
            >
              DROUGHT
            </Text>
          </Box>
          <Box sx={{ mt: [2], position: 'relative' }}>
            <Text sx={{ ...sx.numberCenter, color: 'blue' }}>
              {(insectsTotal * 100).toFixed(0)}%
            </Text>
            <Donut data={insectsFraction} color={'blue'} />
            <Text
              sx={{
                ...sx.numberCenter,
                top: '98px',
                fontSize: [1],
                color: 'blue',
              }}
            >
              INSECTS
            </Text>
          </Box>
        </Grid>
      </Box>
    </Box>
  )
}
