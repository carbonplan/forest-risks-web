import * as geo from '../../geo-utils'
import CursorManager from './cursor-manager'

export default function CircleRenderer({
  map,
  onChange = () => {},
  onIdle = () => {},
  initialCenter = { lat: 0, lng: 0 },
  initialRadius = 0,
}) {
  let circle = null
  let center = initialCenter
  let radius = initialRadius
  const removers = []

  //// SOURCES ////

  function addSources() {
    map.addSource('circle', {
      type: 'geojson',
      data: null,
    })

    map.addSource('circle-mask', {
      type: 'geojson',
      data: null,
    })

    map.addSource('drag-handle', {
      type: 'geojson',
      data: null,
    })

    removers.push(function removeSources() {
      map.removeSource('circle')
      map.removeSource('circle-mask')
      map.removeSource('drag-handle')
    })
  }

  //// LAYERS ////

  function addLayers() {
    map.addLayer({
      id: 'circle/border',
      source: 'circle',
      type: 'line',
      paint: {
        'line-width': 3.0,
        'line-color': '#FFF',
      },
    })

    map.addLayer({
      id: 'circle/fill',
      source: 'circle',
      type: 'fill',
      paint: {
        'fill-color': 'transparent',
      },
    })

    map.addLayer({
      id: 'circle-mask/fill',
      source: 'circle-mask',
      type: 'fill',
      paint: {
        'fill-color': '#FFF',
        'fill-opacity': 0.2,
      },
    })

    map.addLayer({
      id: 'drag-handle/circle',
      source: 'drag-handle',
      type: 'circle',
      paint: {
        'circle-color': '#FFF',
        'circle-radius': 8,
      },
    })

    removers.push(function removeLayers() {
      map.removeLayer('circle/border')
      map.removeLayer('circle/fill')
      map.removeLayer('circle-mask/fill')
      map.removeLayer('drag-handle/circle')
    })
  }

  //// LISTENERS ////

  function addDragHandleListeners() {
    const onMouseMove = (e) => {
      const r = geo.distance(map.unproject(e.point), center)
      setRadius(r)
    }

    const onMouseUp = (e) => {
      onIdle(circle)
      setCursor({ draggingHandle: false })
      map.off('mousemove', onMouseMove)
    }

    const onMouseDown = (e) => {
      e.preventDefault() // block map drag
      e.originalEvent.preventDefault() // block circle drag

      setCursor({ draggingHandle: true })
      map.on('mousemove', onMouseMove)
      map.once('mouseup', onMouseUp)
    }

    const onMouseEnter = (e) => {
      setCursor({ onHandle: true })
    }

    const onMouseLeave = (e) => {
      setCursor({ onHandle: false })
    }

    map.on('mousedown', 'drag-handle/circle', onMouseDown)
    map.on('mouseenter', 'drag-handle/circle', onMouseEnter)
    map.on('mouseleave', 'drag-handle/circle', onMouseLeave)

    removers.push(function removeDragHandleListeners() {
      map.off('mousedown', 'drag-handle/circle', onMouseDown)
      map.off('mouseenter', 'drag-handle/circle', onMouseEnter)
      map.off('mouseleave', 'drag-handle/circle', onMouseLeave)
    })
  }

  function addCircleListeners() {
    let offset

    const onMouseMove = (e) => {
      setCenter({
        lng: e.lngLat.lng - offset.lng,
        lat: e.lngLat.lat - offset.lat,
      })
    }

    const onMouseUp = (e) => {
      onIdle(circle)
      setCursor({ draggingCircle: false })
      map.off('mousemove', onMouseMove)
    }

    const onMouseDown = (e) => {
      // test whether the drag handle was hit
      if (e.originalEvent.defaultPrevented) {
        return
      }
      // block map drag
      e.preventDefault()

      offset = {
        lng: e.lngLat.lng - center.lng,
        lat: e.lngLat.lat - center.lat,
      }
      map.on('mousemove', onMouseMove)
      map.once('mouseup', onMouseUp)
      setCursor({ draggingCircle: true })
    }

    const onMouseEnter = (e) => {
      setCursor({ onCircle: true })
    }

    const onMouseLeave = (e) => {
      setCursor({ onCircle: false })
    }

    map.on('mousedown', 'circle/fill', onMouseDown)
    map.on('mouseenter', 'circle/fill', onMouseEnter)
    map.on('mouseleave', 'circle/fill', onMouseLeave)

    removers.push(function removeCircleListeners() {
      map.off('mousedown', 'circle/fill', onMouseDown)
      map.off('mouseenter', 'circle/fill', onMouseEnter)
      map.off('mouseleave', 'circle/fill', onMouseLeave)
    })
  }

  //// SETTERS ////

  const setCursor = CursorManager(map)

  function setCenter(_center) {
    if (_center && _center !== center) {
      center = _center
      setCircle()
    }
  }

  function setRadius(_radius) {
    if (_radius && _radius !== radius) {
      radius = _radius
      setCircle()
    }
  }

  function setCircle() {
    circle = geo.circle(center, radius)
    const mask = geo.mask(circle)
    const handle = geo.destination(center, radius, 90)

    map.getSource('circle').setData(circle)
    map.getSource('circle-mask').setData(mask)
    map.getSource('drag-handle').setData(handle)

    onChange(circle)
  }

  //// INIT ////

  addSources()
  addLayers()
  addDragHandleListeners()
  addCircleListeners()
  setCircle()
  onIdle(circle)

  //// INTERFACE ////

  return {
    setCenter,
    setRadius,
    remove: () => {
      removers.reverse().forEach((remove) => remove())
      onChange(null)
      onIdle(null)
    },
  }
}
