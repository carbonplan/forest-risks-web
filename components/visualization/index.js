/** @jsx jsx */
import { useState } from 'react'
import { jsx, Box, Text, Grid } from 'theme-ui'
import TimeSeries from './time-series'
import Donut from './donut'
import { allOptions, optionKey, optionIndex, plotRanges } from '@constants'
import * as d3 from 'd3'

function getAverageForYear(points, key) {
  if (!points.length) return null

  const sum = points.reduce((_sum, point) => _sum + point.properties[key], 0)
  return sum / points.length
}

const Sparkline = ({ scales, values }) => {
    const width = 315
    const height = 63
    const x = d3.scaleLinear().domain(scales.x).range([0, width])
    const y = d3.scaleLinear().domain(scales.y).range([height, 0])
    var line = d3
      .line()
      .x(function (d) {
        return x(d[0])
      })
      .y(function (d) {
        return y(d[1])
      })
    return (
      <svg width={width} height={height}>
        {values.map((d, i) => {
          return <path
            sx={{
              stroke: 'green',
              fill: 'none',
              strokeWidth: 2,
              opacity: 0.1
            }}
            key={i}
            d={line(d)}
          ></path>
          })
        }
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
  const biomassTime = biomassPoints.slice(0,100).map((point) => {
    const array = []
    years.forEach((year, index) => {
      const key = optionKey({
        scenario: options.scenario,
        year: year,
      })
      array.push([parseInt(year), point.properties[key]])
    })
    return array
  })

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

  const biomassMax = biomassTime
    .map((d) => d.map((dd) => dd[1]))
    .map((d) => d.reduce((a, b) => Math.max(a, b), 0))
    .reduce((a, b) => Math.max(a, b), 0)

  const biomass = stats.biomass.averages.map((d) => d.y)
  const biomassDelta = biomass
    .slice(1, biomass.length)
    .map((_, i) => biomass[i + 1] - biomass[i])
    .reduce((a, b) => a + b, 0)

  const key = optionIndex('years', options.year)

  const fireTotal = stats.fire.averages.map((d) => d.y)[key]
  const fireFraction = points['fire'].map((d) => {
    const key = optionKey({
      scenario: options.scenario,
      year: options.year,
    })
    if (d.properties[key] > 0.02) return 1
    else return 0
  }).reduce((a, b) => a + b, 0) / points['fire'].length
  
  const droughtTotal = stats.drought.averages.map((d) => d.y)[key]
  const droughtFraction = points['drought'].map((d) => {
    const key = optionKey({
      scenario: options.scenario,
      year: options.year,
    })
    if (d.properties[key] > 0.1) return 1
    else return 0
  }).reduce((a, b) => a + b, 0) / points['drought'].length

  const insectsTotal = stats.insects.averages.map((d) => d.y)[key]
  const insectsFraction = points['insects'].map((d) => {
    const key = optionKey({
      scenario: options.scenario,
      year: options.year,
    })
    if (d.properties[key] > 0.1) return 1
    else return 0
  }).reduce((a, b) => a + b, 0) / points['insects'].length
  
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
      fontFamily: 'monospace',
      letterSpacing: 'monospace',
      fontSize: [4],
      display: 'inline-block',
      ml: [3],
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      top: '28px',
      left: '-18px',
      width: '100%'
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
      mb: [3]
    }
  }

  return (
    <Box>
      <Box sx={sx.group}>
        <Text sx={sx.label}>Biomass</Text>
        <Text sx={sx.unit}>t / ha</Text>
        <Text sx={{ ...sx.numberRight, color: 'green' }}>
          +{biomassDelta.toFixed(2)}
        </Text>
        <Text sx={sx.explanation}>
          Our biomass map shows an expected increase
          due to continued growth in existing forested areas.
          The degree of growth is based on models fit to historical data.
          Each line here shows a biomass growth curve from one of the plots
          within the selection.
        </Text>
        <Sparkline 
          scales={{x: [2020, 2100], y: [0, biomassMax]}}
          values={biomassTime}
        />
      </Box>
      <Box sx={sx.group}>
        <Text sx={sx.label}>Risks</Text>
        <Text sx={sx.explanation}>
          Risk scores along several dimensions represent threats
          to forest carbon permanence. Numbers here represent average risk,
          and the fraction of each donut shows the fraction of plots within the
          selected region where risk was above a threshold.
        </Text>
        <Grid columns={[3]}>
          <Box sx={{ mt: [2], position: 'relative' }}>
            <Text sx={{ ...sx.number, color: 'orange' }}>
              {(fireTotal * 100).toFixed(0)}%
            </Text>
            <Donut data={fireFraction} color={'orange'}/>
          </Box>
          <Box sx={{ mt: [2], position: 'relative' }}>
            <Text sx={{ ...sx.number, color: 'pink' }}>
              {(droughtTotal * 100).toFixed(0)}%
            </Text>
            <Donut data={droughtFraction} color={'pink'}/>
          </Box>
          <Box sx={{ mt: [2], position: 'relative'}}>
            <Text sx={{ ...sx.number, color: 'blue' }}>
              {(insectsTotal * 100).toFixed(0)}%
            </Text>
            <Donut data={insectsFraction} color={'blue'}/>
          </Box>
        </Grid>
      </Box>
    </Box>
  )
}
