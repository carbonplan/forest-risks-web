import { scaleLinear } from 'd3-scale'
import { Box } from 'theme-ui'

const Histogram = ({ scales, values }) => {
  const height = 63
  const y = scaleLinear().domain([0, 1]).range([0, height])
  return (
    <svg width='100%' height={height} preserveAspectRatio='none'>
      {values.map((d, i) => {
        return (
          <svg x={`${i * 0.317 * 40}%`} y='0%' key={i}>
            <g transform={`scale(1, 1)`}>
              <Box
                as='rect'
                sx={{
                  fill: 'green',
                  opacity: 0.2,
                }}
                width={'10%'}
                height={y(1)}
              ></Box>
              {!isNaN(d) && (
                <Box
                  as='rect'
                  sx={{
                    fill: 'green',
                    opacity: 1,
                  }}
                  width={'10%'}
                  height={y(d)}
                  transform={`translate(0, ${height - y(d)})`}
                ></Box>
              )}
            </g>
          </svg>
        )
      })}
    </svg>
  )
}

export default Histogram
