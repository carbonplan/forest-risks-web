import { useRef, useEffect } from 'react'
import { useThemeUI, Box, Flex, Button } from 'theme-ui'
import * as d3 from 'd3'
import * as P from 'polished'

export default function Donut({ data, color }) {
  const boxRef = useRef(null)
  const {
    theme: { rawColors: colors },
  } = useThemeUI()

  data = isNaN(data) ? 0 : data

  useEffect(() => {
    const width = 90
    const height = 90
    const margin = 0

    var radius = Math.min(width, height) / 2 - margin

    const svg = d3
      .select(boxRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

    const entries = [
      { key: 0, value: 1 - data },
      { key: 1, value: data },
    ]

    var colorScale = d3
      .scaleOrdinal()
      .domain([0, 1])
      .range([P.rgba(colors[color], 0.2), colors[color]])

    var pie = d3
      .pie()
      .value(function (d) {
        return d.value
      })
      .sort(null)
    var dataReady = pie(entries)

    svg
      .selectAll('.pie')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(28).outerRadius(radius))
      .attr('fill', function (d) {
        return colorScale(d.data.key)
      })

    return function cleanup() {
      boxRef.current.innerHTML = ''
    }
  }, [data, colors])

  return (
    <Flex sx={{ justifyContent: 'center' }}>
      <Box ref={boxRef} sx={{ height: '100px', width: '100px' }} />
    </Flex>
  )
}
