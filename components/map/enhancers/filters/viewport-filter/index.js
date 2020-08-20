import { useEffect } from 'react'

function ViewportFilter({ map, onChangeRegion }) {
  useEffect(() => {
    const update = () => onChangeRegion({
      properties: {
        bounds: map.getBounds().toArray(),
      }
    })

    update()
    map.on('moveend', update)
    return function cleanup() {
      map.off('moveend', update)
    }
  }, [])

  return null
}

export default ViewportFilter
