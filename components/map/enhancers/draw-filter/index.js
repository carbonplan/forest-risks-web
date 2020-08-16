import { useRef, useState, useEffect } from 'react'
import * as turf from '@turf/turf'
import { getSelectedData } from '../circle-filter/helpers'

function addPointsToMap(map, points, options, onChangeSelectedData, cb = () => {}) {
  if (points.length < 4) return

  const region = turf.polygon([points], {
    source: 'carbonplan.org',
  })

  region.properties = {
    type: 'Drawn',
    export: turf.featureCollection([JSON.parse(JSON.stringify(region))])
  }

  map.getSource('draw').setData(region)
  //map.getSource('draw-mask').setData(turf.mask(region))

  map.once('idle', () => {
    const layers = Object.keys(options).filter((key) => options[key])
    const selectedData = getSelectedData(map, layers, region)
    onChangeSelectedData(selectedData)
    cb()
  })
}

function DrawFilter({ map, options, onChangeSelectedData }) {
  const canvasRef = useRef(null)
  const mapCanvas = map.getCanvas()
  const originalCursorStyle = mapCanvas.style.cursor
  const { width, height } = mapCanvas.getBoundingClientRect()

  useEffect(() => {
    // https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'red'

    let drawing = false
    let initialPos
    let pos
    let points = []

    const setPosition = e => {
      pos = { ...e.point }
      points.push(e.lngLat.toArray())
    }

    const draw = e => {
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
      setPosition(e);
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }

    const stopDrawing = e => {
      if (!drawing) return

      drawing = false
      map.off('mousemove', draw)
      map.off('contextmenu', stopDrawing)
      map.dragPan.enable()
      map.scrollZoom.enable()
      mapCanvas.style.cursor = originalCursorStyle
      draw(initialPos)
      addPointsToMap(map, points, options, onChangeSelectedData, () => {
        ctx.clearRect(0, 0, width, height)

      })
      points = []
    }

    const startDrawing = e => {
      if (drawing) return

      drawing = true
      e.preventDefault()
      map.dragPan.disable()
      map.scrollZoom.disable()
      mapCanvas.style.cursor = 'crosshair'
      initialPos = e
      setPosition(e)
      map.on('mousemove', draw)
      map.once('click', stopDrawing)
      map.on('contextmenu', stopDrawing)
    }

    map.addSource('draw', {
      type: 'geojson',
      data: null,
    })

    map.addLayer({
      id: 'draw/line',
      source: 'draw',
      type: 'line',
      paint: {
        'line-width': 3.0,
        'line-color': '#FFFFFF',
      },
    })

    // map.addSource('draw-mask', {
    //   type: 'geojson',
    //   data: null,
    // })
    //
    // map.addLayer({
    //   id: 'draw-mask/fill',
    //   source: 'draw-mask',
    //   type: 'fill',
    //   paint: {
    //     'fill-color': '#FFFFFF',
    //     'fill-opacity': 0.2,
    //   }
    // })

    map.on('contextmenu', startDrawing)

    return function cleanup() {
      map.off('contextmenu', startDrawing)
      map.removeLayer('draw/line')
      map.removeSource('draw')
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="draw-filter"
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
        pointerEvents: 'none'
      }}
    />
  )
}

export default DrawFilter
