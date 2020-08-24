import * as geo from '@utils'
import CursorManager from './cursor-manager'
import * as d3 from 'd3'
import * as turf from '@turf/turf'
import {
  FLOATING_HANDLE,
  SHOW_RADIUS_GUIDELINE,
  CIRCLE_STICKS_TO_CENTER,
  SHOW_CIRCLE_XY,
} from '@constants'

export default function CircleRenderer({
  map,
  onIdle = (circle) => {},
  onDrag = (circle) => {},
  onSetRadius = (circle) => {},
  initialCenter = { lat: 0, lng: 0 },
  initialRadius = 0,
}) {
  let circle = null
  let center = initialCenter
  let radius = initialRadius

  const svg = d3.select('#circle-picker').style('pointer-events', 'none')
  const svgCircle = d3.select('#circle').style('pointer-events', 'none')
  const svgCircleCenter = d3.select('#circle-center')
  const svgCircleMask = d3.select('#circle-mask-cutout')
  const svgHandle = d3.select('#handle').style('pointer-events', 'all')
  const svgGuideline = d3.select('#radius-guideline')
  const svgGuidelineText = d3.select('#radius-text')
  const svgCircleXY = d3.select('#circle-xy')

  let guidelineAngle = 90
  if (!SHOW_RADIUS_GUIDELINE) {
    svgGuideline.style('display', 'none')
    svgGuidelineText.style('display', 'none')
  }

  const removers = []

  //// LISTENERS ////

  function addDragHandleListeners() {
    const onMouseMove = (e) => {
      const r = geo.distance(map.unproject(e.point), center)
      setRadius(r)
      onDrag(circle)

      if (FLOATING_HANDLE) {
        const centerXY = map.project(center)
        const mouseXY = e.point
        const rise = mouseXY.y - centerXY.y
        const run = mouseXY.x - centerXY.x
        let angle = (Math.atan(rise / run) * 180) / Math.PI
        guidelineAngle = angle + 90 + (run < 0 ? 180 : 0)
      }
    }

    const onMouseUp = (e) => {
      onIdle(circle)
      setCursor({ draggingHandle: false })
      map.off('mousemove', onMouseMove)
      svgHandle.style('pointer-events', 'all')
      if (!CIRCLE_STICKS_TO_CENTER) svgCircle.style('pointer-events', 'all')
      svgGuidelineText.attr('fill-opacity', 0)
      svgGuideline.attr('stroke-opacity', 0)
    }

    svgHandle.on('mousedown', () => {
      map.on('mousemove', onMouseMove)
      map.once('mouseup', onMouseUp)
      setCursor({ draggingHandle: true })
      svgHandle.style('pointer-events', 'none')
      svgCircle.style('pointer-events', 'none')
      svgGuidelineText.attr('fill-opacity', 1)
      svgGuideline.attr('stroke-opacity', 1)
    })

    removers.push(function removeDragHandleListeners() {
      svgHandle.on('mousedown', null)
    })
  }

  function addCircleListeners() {
    let offset

    const onMouseMove = (e) => {
      setCenter({
        lng: e.lngLat.lng - offset.lng,
        lat: e.lngLat.lat - offset.lat,
      })
      onDrag(circle)
    }

    const onMouseUp = (e) => {
      onIdle(circle)
      setCursor({ draggingCircle: false })
      map.off('mousemove', onMouseMove)
      svgCircle.style('pointer-events', 'all')
      svgHandle.style('pointer-events', 'all')
    }

    svgCircle.on('mousedown', () => {
      const { offsetX: x, offsetY: y } = d3.event
      const lngLat = map.unproject({ x, y })
      offset = {
        lng: lngLat.lng - center.lng,
        lat: lngLat.lat - center.lat,
      }

      setCursor({ draggingCircle: true })
      map.on('mousemove', onMouseMove)
      map.once('mouseup', onMouseUp)
      svgCircle.style('pointer-events', 'none')
      svgHandle.style('pointer-events', 'none')
    })

    svgCircle.on('wheel', () => {
      let e = d3.event
      e.preventDefault()
      let newEvent = new e.constructor(e.type, e)
      mapCanvas.dispatchEvent(newEvent)
    })

    svgCircle.style('pointer-events', 'all')
    svgCircle.style('cursor', 'move')
  }

  function removeCircleListeners() {
    svgCircle.style('pointer-events', 'none')
    svgCircle.style('cursor', '')

    svgCircle.on('mousedown', null)
    svgCircle.on('wheel', null)
  }

  function addShiftListeners() {
    const onShiftDown = (e) => {
      if (e.key === 'Shift') addCircleListeners()
    }

    const onShiftUp = (e) => {
      if (e.key === 'Shift') removeCircleListeners()
    }

    document.addEventListener('keydown', onShiftDown)
    document.addEventListener('keyup', onShiftUp)
    removers.push(function removeShiftListeners() {
      document.removeEventListener('keydown', onShiftDown)
      document.addEventListener('keyup', onShiftUp)
    })
  }

  function addMapMoveListeners() {
    const onMove = CIRCLE_STICKS_TO_CENTER
      ? () => setCenter(map.getCenter())
      : setCircle
    const onMoveEnd = CIRCLE_STICKS_TO_CENTER ? () => onIdle(circle) : () => {}

    map.on('move', onMove)
    map.on('moveend', onMoveEnd)

    removers.push(function removeMapMoveListeners() {
      map.off('move', onMove)
      map.off('moveend', onMoveEnd)
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

    // update svg circle and mask
    const makePath = geo.getPathMaker(map)
    const path = makePath(circle)
    svgCircle.attr('d', path)
    svgCircleMask.attr('d', path)

    // update other svg elements
    const centerXY = map.project(center)

    const handleXY = (() => {
      const lineEnd = turf.rhumbDestination(
        [center.lng, center.lat],
        radius * 2,
        guidelineAngle
      )

      const line = turf.lineString([
        [center.lng, center.lat],
        lineEnd.geometry.coordinates,
      ])

      const inter = turf.lineIntersect(line, circle)

      return map.project(inter.features[0].geometry.coordinates)
    })()

    svgCircleCenter.attr('cx', centerXY.x).attr('cy', centerXY.y)

    svgHandle.attr('cx', handleXY.x).attr('cy', handleXY.y)

    svgGuideline
      .attr('x1', centerXY.x)
      .attr('y1', centerXY.y)
      .attr('x2', handleXY.x)
      .attr('y2', handleXY.y)

    svgGuidelineText
      .attr('x', handleXY.x + 12)
      .attr('y', handleXY.y + 4)
      .text(radius.toFixed(0) + 'mi')

    if (SHOW_CIRCLE_XY) {
      const radiusXY = Math.sqrt(
        Math.pow(handleXY.x - centerXY.x, 2) +
          Math.pow(handleXY.y - centerXY.y, 2)
      )
      svgCircleXY
        .attr('cx', centerXY.x)
        .attr('cy', centerXY.y)
        .attr('r', radiusXY)
        .attr('stroke-opacity', 1)
    }
  }

  //// INIT ////

  addDragHandleListeners()
  addShiftListeners()
  addMapMoveListeners()
  setCircle()
  onIdle(circle)

  //// INTERFACE ////

  return {
    setCenter: (center) => {
      setCenter(center)
      onIdle(circle)
    },
    setRadius: (radius) => {
      setRadius(radius)
      onSetRadius(circle)
    },
    remove: () => {
      removers.reverse().forEach((remove) => remove())
      onIdle(null)
    },
  }
}
