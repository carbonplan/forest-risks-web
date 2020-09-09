// adapted from https://www.d3-graph-gallery.com/graph/violin_basicHist.html
// and https://www.d3-graph-gallery.com/graph/boxplot_several_groups.html

import { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import * as d3Collection from 'd3-collection'
import { useThemeUI, Flex, Box } from 'theme-ui'

const PLOT_TYPES = {
  VIOLIN: 'violin',
  BOXPLOT: 'boxplot',
}
const PATHWAYS = ['forests', 'fires']
const YEARS = [2015, 2050, 2085]
const NUM_BINS = 50
const COLORS = { forests: '#7eb36a', fires: '#ea9755' }

function modifyData(data, pathway) {
  const modifiedData = []
  const points = data.points[pathway] || []
  points.forEach((point) => {
    YEARS.forEach((year) => {
      modifiedData.push({
        year,
        value: point.properties[year],
      })
    })
  })
  return modifiedData
}

export default function Violin({ data }) {
  const boxRef = useRef(null)
  const [pathwayIdx, setPathwayIdx] = useState(0)
  const [plotType, setPlotType] = useState(PLOT_TYPES.VIOLIN)
  const { theme } = useThemeUI()

  useEffect(() => {
    if (!data) return

    const pathway = PATHWAYS[pathwayIdx]
    const color = COLORS[pathway]
    data = modifyData(data, pathway)

    const margin = { top: 10, right: 10, bottom: 20, left: 40 }
    const width = boxRef.current.clientWidth - margin.left - margin.right
    const height = boxRef.current.clientHeight - margin.top - margin.bottom

    // svg
    const svg = d3
      .select(boxRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('display', 'block')
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // y-axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([height, 0])
      .nice()
    svg.append('g').style('font-family', theme.fonts.faux).call(d3.axisLeft(y))

    // x-axis
    const x = d3.scaleBand().range([0, width]).domain(YEARS).padding(0.05)
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .style('font-family', theme.fonts.faux)
      .call(d3.axisBottom(x))

    switch (plotType) {
      case PLOT_TYPES.VIOLIN: {
        const histogram = d3
          .histogram()
          .domain(y.domain())
          .thresholds(y.ticks(NUM_BINS))
          .value((d) => d)

        const sumstat = d3Collection
          .nest()
          .key((d) => d.year)
          .rollup((d) => {
            const input = d.map((g) => g.value)
            return histogram(input)
          })
          .entries(data)

        const xNum = (() => {
          let maxNum = 0
          sumstat.forEach((stat) => {
            const lengths = stat.value.map((a) => a.length)
            const longest = d3.max(lengths)
            if (longest > maxNum) maxNum = longest
          })
          return d3
            .scaleLinear()
            .range([0, x.bandwidth()])
            .domain([-maxNum, maxNum])
        })()

        svg
          .selectAll('violin-plot')
          .data(sumstat)
          .enter()
          .append('g')
          .attr('transform', (d) => `translate(${x(d.key)},0)`)
          .append('path')
          .datum((d) => d.value)
          .style('stroke', 'none')
          .style('fill', color)
          .attr(
            'd',
            d3
              .area()
              .x0((d) => xNum(-d.length))
              .x1((d) => xNum(d.length))
              .y((d) => y(d.x0))
              .curve(d3.curveCatmullRom)
          )

        break
      }

      case PLOT_TYPES.BOXPLOT: {
        const bandWidth = x.bandwidth()
        const boxWidth = bandWidth * 0.6
        const tickWidth = 10

        const sumstat = d3Collection
          .nest()
          .key((d) => d.year)
          .rollup((d) => {
            const sorted = d.map((g) => g.value).sort(d3.ascending)
            const minValue = sorted[0]
            const maxValue = sorted[sorted.length - 1]
            const q1 = d3.quantile(sorted, 0.25)
            const q3 = d3.quantile(sorted, 0.75)
            const interQuantileRange = q3 - q1
            return {
              q1,
              median: d3.quantile(sorted, 0.5),
              q3,
              interQuantileRange,
              min: Math.max(minValue, q1 - 1.5 * interQuantileRange),
              max: Math.min(maxValue, q3 + 1.5 * interQuantileRange),
            }
          })
          .entries(data)

        svg
          .selectAll('vert-lines')
          .data(sumstat)
          .enter()
          .append('line')
          .attr('x1', (d) => x(d.key) + bandWidth / 2)
          .attr('x2', (d) => x(d.key) + bandWidth / 2)
          .attr('y1', (d) => y(d.value.min))
          .attr('y2', (d) => y(d.value.max))
          .attr('stroke', 'currentColor')

        svg
          .selectAll('boxes')
          .data(sumstat)
          .enter()
          .append('rect')
          .attr('x', (d) => x(d.key) - boxWidth / 2 + bandWidth / 2)
          .attr('y', (d) => y(d.value.q3))
          .attr('height', (d) => y(d.value.q1) - y(d.value.q3))
          .attr('width', boxWidth)
          .attr('stroke', 'currentColor')
          .style('fill', color)

        svg
          .selectAll('median-lines')
          .data(sumstat)
          .enter()
          .append('line')
          .attr('x1', (d) => x(d.key) - boxWidth / 2 + bandWidth / 2)
          .attr('x2', (d) => x(d.key) + boxWidth / 2 + bandWidth / 2)
          .attr('y1', (d) => y(d.value.median))
          .attr('y2', (d) => y(d.value.median))
          .attr('stroke', 'currentColor')

        svg
          .selectAll('max-ticks')
          .data(sumstat)
          .enter()
          .append('line')
          .attr('x1', (d) => x(d.key) - tickWidth / 2 + bandWidth / 2)
          .attr('x2', (d) => x(d.key) + tickWidth / 2 + bandWidth / 2)
          .attr('y1', (d) => y(d.value.max))
          .attr('y2', (d) => y(d.value.max))
          .attr('stroke', 'currentColor')

        svg
          .selectAll('min-ticks')
          .data(sumstat)
          .enter()
          .append('line')
          .attr('x1', (d) => x(d.key) - tickWidth / 2 + bandWidth / 2)
          .attr('x2', (d) => x(d.key) + tickWidth / 2 + bandWidth / 2)
          .attr('y1', (d) => y(d.value.min))
          .attr('y2', (d) => y(d.value.min))
          .attr('stroke', 'currentColor')

        break
      }
    }

    return function cleanup() {
      boxRef.current.innerHTML = ''
    }
  }, [data, pathwayIdx, plotType])

  const cyclePathway = useCallback(
    (inc) => {
      const numPathways = PATHWAYS.length
      const newIdx = (pathwayIdx + inc + numPathways) % numPathways
      setPathwayIdx(newIdx)
    },
    [pathwayIdx]
  )

  const cyclePlotType = useCallback(() => {
    const newPlotType =
      plotType === PLOT_TYPES.VIOLIN ? PLOT_TYPES.BOXPLOT : PLOT_TYPES.VIOLIN
    setPlotType(newPlotType)
  }, [plotType])

  const buttonStyles = {
    cursor: 'pointer',
  }

  return (
    <Flex sx={{ height: '100%', flexDirection: 'column' }}>
      <Box ref={boxRef} sx={{ flex: 1 }} />
      <Flex
        sx={{
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 40,
        }}
      >
        <Flex>
          <Box sx={buttonStyles} onClick={() => cyclePathway(-1)}>
            {'<'}
          </Box>
          <Box sx={{ width: 70, textAlign: 'center' }}>
            {PATHWAYS[pathwayIdx]}
          </Box>
          <Box sx={buttonStyles} onClick={() => cyclePathway(1)}>
            {'>'}
          </Box>
        </Flex>
        <Flex>
          <Box sx={buttonStyles} onClick={cyclePlotType}>
            {'<'}
          </Box>
          <Box sx={{ width: 70, textAlign: 'center' }}>{plotType}</Box>
          <Box sx={buttonStyles} onClick={cyclePlotType}>
            {'>'}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}
