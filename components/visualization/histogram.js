// adapted from https://www.d3-graph-gallery.com/graph/histogram_basic.html

import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { Box } from 'theme-ui'

const NUM_BINS = 20
const FORESTS_COLOR = '#7eb36a'
const FIRES_COLOR = '#ea9755'

export default function Hist({ data }) {
  const histRef = useRef(null)

  useEffect(() => {
    if (!data || !data.points.fires) return

    const points = data.points.fires.map(f => f.properties[2015])

    const margin = { top: 10, right: 10, bottom: 40, left: 40 }
    const width = histRef.current.offsetWidth - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const svg = d3
      .select(histRef.current)
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        //.style('border', '1px red solid')
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3
      .scaleLinear()
        .domain([0, d3.max(points, (d) => d)])
        .range([0, width])

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)')

    const histogram = d3
      .histogram()
        .value((d) => d)
        .domain(x.domain())
        .thresholds(x.ticks(NUM_BINS))

    const bins = histogram(points)

    const y = d3.scaleLinear().range([height, 0])
    y.domain([0, d3.max(bins, (d) => d.length)])
    svg.append('g').call(d3.axisLeft(y))

    svg
      .selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
        .attr('x', 1)
        .attr('transform', (d) => `translate(${x(d.x0)},${y(d.length)})`)
        .attr('width', (d) => x(d.x1) - x(d.x0) - 1)
        .attr('height', (d) => height - y(d.length))
        .style('fill', FIRES_COLOR)

    return function cleanup() {
      histRef.current.innerHTML = ''
    }
  }, [data])

  return (
    <Box
      sx={{ margin: 16 }}
      ref={histRef}
    />
  )
}
