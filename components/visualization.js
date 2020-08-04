import { Box } from 'theme-ui'
import { isPointInPolygon } from './geo-utils'

function getPointsInRegion(points, region) {
  if (!region) return points

  return points.filter((p) =>
    isPointInPolygon([p.properties.lon, p.properties.lat], region)
  )
}

function getAverageForYear(points, year) {
  if (!points.length) return null

  const values = points.map((p) => p.properties[year])
  const sum = values.reduce((p, c) => p + c, 0)
  return sum / values.length
}

export default function Visualization({ mapData, filterRegion }) {
  if (!mapData) return null

  const types = ['forests', 'fires']
  const years = [2015, 2050, 2085]

  const stats = {}
  types.forEach((type) => {
    const points = mapData[type]
    const filteredPoints = getPointsInRegion(points, filterRegion)

    stats[type] = {
      count: filteredPoints.length,
      averages: {},
    }

    years.forEach((year) => {
      stats[type].averages[year] = getAverageForYear(filteredPoints, year)
    })
  })

  return (
    <Box sx={{ padding: 16 }}>
      <Box sx={{ textTransform: 'uppercase' }}>Location</Box>
      {filterRegion ? (
        <>
          <Box>Lng: {filterRegion.properties.center.lng}</Box>
          <Box>Lat: {filterRegion.properties.center.lat}</Box>
          <Box>Radius: {filterRegion.properties.radius.toFixed(2)} miles</Box>
        </>
      ) : (
        <Box>United States</Box>
      )}
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
