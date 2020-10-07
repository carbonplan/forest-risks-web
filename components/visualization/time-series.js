import { useRef, useEffect } from 'react'
import { useThemeUI, Box, Flex, Button } from 'theme-ui'
import * as d3 from 'd3'
import * as P from 'polished'

export default function TimeSeries({ data, domain, range, color }) {
  const boxRef = useRef(null)
  const { theme } = useThemeUI()

  useEffect(() => {
    const margin = { top: 10, right: 0, bottom: 10, left: 0 }
    const width = boxRef.current.offsetWidth - margin.left - margin.right
    const height = boxRef.current.offsetHeight - margin.top - margin.bottom

    const svg = d3
      .select(boxRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain(domain).range([0, width])
    const y = d3.scaleLinear().domain(range).range([height, 0])

    svg
      .append('path')
      .datum([{x: domain[0], y: 0}, {x: domain[0] + 5, y: 0}])
      .attr('fill', 'none')
      .attr('stroke', theme.colors.muted)
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 1)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(d.x)
          })
          .y(function (d) {
            return y(d.y)
          })
      )

    svg
      .append('text')
      .attr('transform', `translate(${0 + 25},${height + 5})`)
      .style('text-anchor', 'left')
      .style('fill', theme.colors.muted)
      .style('font-size', 16)
      .style('font-family', theme.fonts.faux)
      .text(range[0])

    svg
      .append('path')
      .datum([{x: domain[0], y: range[1]}, {x: domain[0] + 5, y: range[1]}])
      .attr('fill', 'none')
      .attr('stroke', theme.colors.muted)
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 1)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(d.x)
          })
          .y(function (d) {
            return y(d.y)
          })
      )

    svg
      .append('text')
      .attr('transform', `translate(${0 + 25},${5})`)
      .style('text-anchor', 'left')
      .style('fill', theme.colors.muted)
      .style('font-size', 16)
      .style('font-family', theme.fonts.faux)
      .text(range[1])

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', theme.colors[color])
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(d.x)
          })
          .y(function (d) {
            return y(d.y)
          })
      )

    return function cleanup() {
      boxRef.current.innerHTML = ''
    }
  }, [data, theme])

  return <Box ref={boxRef} sx={{ height: '80px' }} />
}
