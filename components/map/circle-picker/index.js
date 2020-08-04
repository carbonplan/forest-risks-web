import { useState, useEffect } from 'react'
import CircleRenderer from './circle-renderer'

const CirclePicker = ({ map, center, radius, onChange, onIdle }) => {
  const [renderer, setRenderer] = useState(null)

  useEffect(() => {
    if (!map) return

    const renderer = CircleRenderer({
      map,
      onChange,
      onIdle,
      initialCenter: center,
      initialRadius: radius,
    })

    setRenderer(renderer)

    return renderer.remove
  }, [map])

  useEffect(() => {
    if (renderer) {
      renderer.setCenter(center)
    }
  }, [renderer, center])

  useEffect(() => {
    if (renderer) {
      renderer.setRadius(radius)
    }
  }, [renderer, radius])

  return null
}

export default CirclePicker
