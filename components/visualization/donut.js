import { useRef, useEffect } from 'react'
import { useThemeUI, Box, Flex, Button } from 'theme-ui'
import { arc, pie } from 'd3-shape'
import { scaleOrdinal } from 'd3-scale'
import { select } from 'd3-selection'

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

    const svg = select(boxRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('viewBox', '0 0 90 90')
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

    const entries = [
      { key: 0, value: 1 - data },
      { key: 1, value: data },
    ]

    var colorScale = scaleOrdinal()
      .domain([0, 1])
      .range([colors[color], colors[color]])

    var generator = pie()
      .value(function (d) {
        return d.value
      })
      .sort(null)
    var dataReady = generator(entries)

    svg
      .selectAll('.pie')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('d', arc().innerRadius(28).outerRadius(radius))
      .attr('fill', function (d) {
        return colorScale(d.data.key)
      })

    return function cleanup() {
      if (boxRef.current) boxRef.current.innerHTML = ''
    }
  }, [data, colors])

  return (
    <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
      <Box ref={boxRef} sx={{ height: 'auto', width: '100%' }} />
    </Flex>
  )
}
