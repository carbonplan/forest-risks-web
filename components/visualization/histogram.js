import * as d3 from 'd3'
import { Box } from 'theme-ui'

const Histogram = ({ scales, values }) => {
  const width = 315
  const height = 63
  const y = d3.scaleLinear().domain([0, 1]).range([0, height])
  return (
    <svg width={width} height={height}>
      {values.map((d, i) => {
        return (
          <g transform={`translate(${i * 40})`} key={i}>
            <Box
              as='rect'
              sx={{
                fill: 'green',
                opacity: 0.2,
              }}
              width={32}
              height={y(1)}
            ></Box>
            {!isNaN(d) && (
              <Box
                as='rect'
                sx={{
                  fill: 'green',
                  opacity: 1,
                }}
                width={32}
                height={y(d)}
                transform={`translate(0, ${height - y(d)})`}
              ></Box>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export default Histogram
