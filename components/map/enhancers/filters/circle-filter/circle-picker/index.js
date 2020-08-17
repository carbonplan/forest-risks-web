import { useState, useEffect } from 'react'
import CircleRenderer from './circle-renderer'

const CirclePicker = ({ map, center, radius, onIdle, onDrag, onSetRadius }) => {
  const [renderer, setRenderer] = useState(null)

  useEffect(() => {
    const renderer = CircleRenderer({
      map,
      onIdle,
      onDrag,
      onSetRadius,
      initialCenter: center,
      initialRadius: radius,
    })

    setRenderer(renderer)

    return function cleanup() {
      // need to check load state for fast-refresh purposes
      if (map.loaded()) renderer.remove()
    }
  }, [])

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
