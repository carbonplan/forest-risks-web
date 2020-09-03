// adapted from https://www.d3-graph-gallery.com/graph/histogram_basic.html

import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { Box } from 'theme-ui'

const PATHWAY = 'forests'
const YEAR = 2050
const NUM_BINS = 30
const COLORS = { forests: '#7eb36a', fires: '#ea9755' }

export default function Hist({ data }) {
  const histRef = useRef(null)

  useEffect(() => {
    if (!data || !data.points[PATHWAY]) return

    const points = data.points[PATHWAY].map((f) => f.properties[YEAR])

    const margin = { top: 10, right: 10, bottom: 50, left: 50 }
    const width = histRef.current.offsetWidth - margin.left - margin.right
    const height = histRef.current.offsetHeight - margin.top - margin.bottom

    const svg = d3
      .select(histRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      //.style('border', '1px red solid')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // x-axis label
    svg.append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 30})`)
      .style('text-anchor', 'middle')
      .style('fill', 'currentColor')
      .style('font-size', 10)
      .text('value')

    // y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('fill', 'currentColor')
        .style('font-size', 10)
        .text('count')

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
    svg.append('g').call(d3.axisLeft(y).tickFormat(d3.format('.0f')))

    const barWidth = width / bins.length
    const barSpacing = 1

    svg
      .selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', 1)
      .attr(
        'transform',
        (d, i) => `translate(${i * barWidth + 0.5 * barSpacing},${y(d.length)})`
      )
      .attr('width', (d) => barWidth - barSpacing)
      .attr('height', (d) => height - y(d.length))
      .style('fill', COLORS[PATHWAY])

    return function cleanup() {
      histRef.current.innerHTML = ''
    }
  }, [data])

  return <Box ref={histRef} sx={{ height: '100%' }} />
}
