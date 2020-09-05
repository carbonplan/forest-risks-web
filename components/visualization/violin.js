// adapted from https://www.d3-graph-gallery.com/graph/violin_basicHist.html

import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import * as d3Collection from 'd3-collection'
import { Box } from 'theme-ui'

const PATHWAY = 'forests'
const YEARS = [2015, 2050, 2085]
const NUM_BINS = 50
const COLORS = { forests: '#7eb36a', fires: '#ea9755' }

function modifyData(data) {
  const modifiedData = []
  data.points[PATHWAY].forEach((point) => {
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

  useEffect(() => {
    if (!data) return

    data = modifyData(data)

    const margin = { top: 10, right: 10, bottom: 30, left: 40 }
    const width = boxRef.current.offsetWidth - margin.left - margin.right
    const height = boxRef.current.offsetHeight - margin.top - margin.bottom

    const svg = d3
      .select(boxRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const yMin = d3.min(data, (d) => d.value)
    const yMax = d3.max(data, (d) => d.value)

    const y = d3.scaleLinear().domain([yMin, yMax]).range([height, 0])
    svg.append('g').call(d3.axisLeft(y))

    const x = d3.scaleBand().range([0, width]).domain(YEARS).padding(0.05)

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))

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
        const bins = histogram(input)
        return bins
      })
      .entries(data)

    let maxNum = 0
    sumstat.forEach((stat) => {
      const lengths = stat.value.map((a) => a.length)
      const longest = d3.max(lengths)
      if (longest > maxNum) maxNum = longest
    })

    const xNum = d3
      .scaleLinear()
      .range([0, x.bandwidth()])
      .domain([-maxNum, maxNum])

    svg
      .selectAll('violin-plot')
      .data(sumstat)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${x(d.key)},0)`)
      .append('path')
      .datum((d) => d.value)
      .style('stroke', 'none')
      .style('fill', COLORS[PATHWAY])
      .attr(
        'd',
        d3
          .area()
          .x0((d) => xNum(-d.length))
          .x1((d) => xNum(d.length))
          .y((d) => y(d.x0))
          .curve(d3.curveCatmullRom)
      )

    return function cleanup() {
      boxRef.current.innerHTML = ''
    }
  }, [data])

  return <Box ref={boxRef} sx={{ height: '100%' }} />
}
