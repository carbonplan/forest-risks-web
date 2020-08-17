import { Box } from 'theme-ui'

function getAverageForYear(points, year) {
  if (!points.length) return null

  const sum = points.reduce((_sum, point) => _sum + point.properties[year], 0)
  return sum / points.length
}

export default function Visualization({ data }) {
  if (!data) return null

  const { region, points } = data

  const years = [2015, 2050, 2085]
  const types = Object.keys(points)

  const stats = {}
  types.forEach((type) => {
    const pointsForType = points[type]
    stats[type] = {
      count: pointsForType.length,
      averages: {},
    }
    years.forEach((year) => {
      stats[type].averages[year] = getAverageForYear(pointsForType, year)
    })
  })

  return (
    <Box sx={{ padding: 16 }}>
      <Box sx={{ textTransform: 'uppercase' }}>Location</Box>
      {(() => {
        switch (region.type) {
          case 'Circle':
            return (
              <>
                <Box>Lng: {region.center.lng}</Box>
                <Box>Lat: {region.center.lat}</Box>
                <Box>Radius: {region.radius.toFixed(2)} miles</Box>
              </>
            )
          case 'File':
            return (
              <>
                <Box>Filename: {region.filename}</Box>
              </>
            )
          case 'Drawn':
            return (
              <Box
                sx={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  const tab = window.open('about:blank', '_blank')
                  tab.document.write(
                    '<html><body><pre>' +
                      JSON.stringify(region.export, null, 2) +
                    '</pre></body></html>'
                  )
                  tab.document.close()
                }}>
                Hand Drawn
              </Box>
            )
          case 'Viewport':
            return (
              <>
                <Box>Viewport</Box>
                <Box>
                  SW: {region.bounds[0][0].toFixed(8)} /{' '}
                  {region.bounds[0][1].toFixed(8)}
                </Box>
                <Box>
                  NE: {region.bounds[1][0].toFixed(8)} /{' '}
                  {region.bounds[1][1].toFixed(8)}
                </Box>
              </>
            )
          default:
            return null
        }
      })()}
      {types.map((type) => (
        <Box key={type}>
          <Box
            sx={{
              marginTop: 16,
              textTransform: 'uppercase',
            }}
          >
            {type} ({stats[type].count})
          </Box>
          <Box>
            {years.map((year) => (
              <Box key={year}>
                {year}: {stats[type].averages[year] || 'no data'}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  )
}
