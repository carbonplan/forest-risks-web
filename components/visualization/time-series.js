import { useRef, useEffect } from 'react'
import { useThemeUI, Box, Flex, Button } from 'theme-ui'
import * as d3 from 'd3'
import * as P from 'polished'

export default function TimeSeries({ data }) {
  const boxRef = useRef(null)
  const { theme } = useThemeUI()

  useEffect(() => {
    const margin = { top: 10, right: 0, bottom: 50, left: 0 }
    const width = boxRef.current.offsetWidth - margin.left - margin.right
    const height = boxRef.current.offsetHeight - margin.top - margin.bottom

    const svg = d3
      .select(boxRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([2000, 2100]).range([0, width])

    // svg.append('g')
    //   .attr('transform', "translate(0," + height + ")")
    //   .call(d3.axisBottom(x))

    const y = d3.scaleLinear().domain([0, 500]).range([height, 0])

    // d3.max(stats.forests.averages, (d) => {return d.biomass})]

    const area = d3
      .area()
      .x(function (d) {
        return x(d.year)
      })
      .y0(height)
      .y1(function (d) {
        return y(d.close)
      })

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', theme.colors.green)
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(d.year)
          })
          .y(function (d) {
            return y(d.biomass)
          })
      )

    svg
      .append('path')
      .datum(data)
      .attr('fill', theme.colors.green)
      .attr('opacity', 0.25)
      .attr(
        'd',
        d3
          .area()
          .x(function (d) {
            return x(d.year)
          })
          .y0(height)
          .y1(function (d) {
            return y(d.biomass)
          })
      )

    svg
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', y(0))
      .attr('x2', 0)
      .attr('y2', y(500))
      .selectAll('stop')
      .data([
        { offset: '0%', color: P.rgba(theme.colors.green, 0) },
        { offset: '100%', color: theme.colors.green },
      ])
      .enter()
      .append('stop')
      .attr('offset', function (d) {
        return d.offset
      })
      .attr('stop-color', function (d) {
        return d.color
      })

    return function cleanup() {
      boxRef.current.innerHTML = ''
    }
  }, [data, theme])

  return <Box ref={boxRef} sx={{ height: '120px' }} />
}
