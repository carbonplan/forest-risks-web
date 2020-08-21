import { useRef, useState, useEffect, useCallback } from 'react'
import * as turf from '@turf/turf'
import { Instructions, Section } from '../instructions'
import { Box, Button, useThemeUI } from 'theme-ui'

function DrawCanvas({ map, lineColor, initialPoint, onPoints }) {
  const canvasRef = useRef(null)
  const bounds = map.getCanvas().style

  useEffect(() => {
    console.log('running useEffect')
    // https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.strokeStyle = lineColor

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
      map.off('mousemove', draw)
      draw(initialPoint)
      onPoints(points)
    }

    setPosition(initialPoint)
    map.on('mousemove', draw)
    map.once('click', stopDrawing)

    return function cleanup() {
      map.off('mousemove', draw)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="draw-filter"
      width={bounds.width}
      height={bounds.height}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  )
}

export default function DrawFilter({ map, onChangeRegion }) {
  const originalCursorStyle = useRef(map.getCanvas().style.cursor)

  const [initialPoint, setInitialPoint] = useState(null)
  const [clearable, setClearable] = useState(false)
  const context = useThemeUI()

  const startDrawing = useCallback((e) => {
    console.log('starting to draw')
    clear()
    e.preventDefault()
    map.dragPan.disable()
    map.scrollZoom.disable()
    map.getCanvas().style.cursor = 'crosshair'
    setInitialPoint(e)
  }, [])

  const stopDrawing = useCallback(() => {
    console.log('stop drawing')
    map.once('contextmenu', startDrawing)
    map.dragPan.enable()
    map.scrollZoom.enable()
    map.getCanvas().style.cursor = originalCursorStyle.current
    setInitialPoint(null)
  }, [])

  useEffect(function init() {
    onChangeRegion(null)

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
      },
    })

    map.once('contextmenu', startDrawing)

    return function cleanup() {
      map.off('contextmenu', startDrawing)
      map.removeLayer('draw/line')
      map.removeSource('draw')
    }
  }, [])

  useEffect(function setLineColor() {
    map.setPaintProperty(
      'draw/line',
      'line-color',
      context.theme.colors.primary
    )
  }, [context])

  const handlePoints = (points) => {
    if (points.length < 4) {
      stopDrawing()
      return
    }

    const region = turf.polygon([points], {
      source: 'carbonplan.org',
    })

    region.properties = {
      export: turf.featureCollection([JSON.parse(JSON.stringify(region))])
    }

    map.getSource('draw').setData(region)

    map.once('idle', () => {
      onChangeRegion(region)
      stopDrawing()
      setClearable(true)
    })
  }

  const clear = () => {
    map.getSource('draw').setData({
      type: 'FeatureCollection',
      features: [],
    })
    onChangeRegion(null)
    setClearable(false)
  }

  return (
    <>
      <Instructions>
        <Section>
          <Box>right-click to start drawing</Box>
          <Box sx={{ marginY: '8px' }}>AND</Box>
          <Box sx={{ marginBottom: '2px' }}>click when you're done</Box>
        </Section>
        {clearable && (
          <Section sx={{ padding: '2px' }}>
            <Button onClick={() => {
              setInitialPoint(null)
              clear()
            }}>
              clear
            </Button>
          </Section>
        )}
      </Instructions>
      {initialPoint && (
        <DrawCanvas
          map={map}
          lineColor={context.theme.colors.primary}
          initialPoint={initialPoint}
          onPoints={handlePoints}
        />
      )}
    </>
  )
}
//
// function addPointsToMap(map, points, cb = () => {}) {
//   if (points.length < 4) return
//
//   const region = turf.polygon([points], {
//     source: 'carbonplan.org',
//   })
//
//   region.properties = {
//     export: turf.featureCollection([JSON.parse(JSON.stringify(region))])
//   }
//
//   map.getSource('draw').setData(region)
//   //map.getSource('draw-mask').setData(turf.mask(region))
//
//   map.once('idle', () => cb(region))
// }
//
// function DrawFilter({ map, onChangeRegion }) {
//   const canvasRef = useRef(null)
//   const context = useThemeUI()
//   const [clearable, setClearable] = useState(false)
//   const [bounds, setBounds] = useState(map.getCanvas().getBoundingClientRect())
//
//   useEffect(function init() {
//     onChangeRegion(null)
//
//     map.addSource('draw', {
//       type: 'geojson',
//       data: null,
//     })
//
//     map.addLayer({
//       id: 'draw/line',
//       source: 'draw',
//       type: 'line',
//       paint: {
//         'line-width': 3.0,
//       },
//     })
//
//     // map.addSource('draw-mask', {
//     //   type: 'geojson',
//     //   data: null,
//     // })
//     //
//     // map.addLayer({
//     //   id: 'draw-mask/fill',
//     //   source: 'draw-mask',
//     //   type: 'fill',
//     //   paint: {
//     //     'fill-color': '#FFFFFF',
//     //     'fill-opacity': 0.2,
//     //   }
//     // })
//
//     const onResize = () => {
//       setBounds(map.getCanvas().getBoundingClientRect())
//     }
//
//     map.on('resize', onResize)
//
//     return function cleanup() {
//       map.off('resize', onResize)
//       map.removeLayer('draw/line')
//       map.removeSource('draw')
//     }
//   }, [])
//
//   useEffect(function setLineColor() {
//     map.setPaintProperty(
//       'draw/line',
//       'line-color',
//       context.theme.colors.primary
//     )
//   }, [context])
//
//   useEffect(function addDrawListeners() {
//     if (!bounds) return
//
//     // https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
//     const ctx = canvasRef.current.getContext('2d')
//     ctx.lineWidth = 3
//     ctx.lineCap = 'round'
//     ctx.strokeStyle = context.theme.colors.primary
//
//     const mapCanvas = map.getCanvas()
//     const originalCursorStyle = mapCanvas.style.cursor
//
//     let drawing = false
//     let initialPos
//     let pos
//     let points = []
//
//     const setPosition = e => {
//       pos = { ...e.point }
//       points.push(e.lngLat.toArray())
//     }
//
//     const draw = e => {
//       ctx.beginPath()
//       ctx.moveTo(pos.x, pos.y)
//       setPosition(e);
//       ctx.lineTo(pos.x, pos.y)
//       ctx.stroke()
//     }
//
//     const stopDrawing = e => {
//       if (!drawing) return
//
//       drawing = false
//       map.off('mousemove', draw)
//       map.off('contextmenu', stopDrawing)
//       map.dragPan.enable()
//       map.scrollZoom.enable()
//       mapCanvas.style.cursor = originalCursorStyle
//       draw(initialPos)
//       addPointsToMap(map, points, (region) => {
//         ctx.clearRect(0, 0, bounds.width, bounds.height)
//         setClearable(true)
//         onChangeRegion(region)
//       })
//       points = []
//     }
//
//     const startDrawing = e => {
//       if (drawing) return
//
//       if (clearable) clear()
//       drawing = true
//       e.preventDefault()
//       map.dragPan.disable()
//       map.scrollZoom.disable()
//       mapCanvas.style.cursor = 'crosshair'
//       initialPos = e
//       setPosition(e)
//       map.on('mousemove', draw)
//       map.once('click', stopDrawing)
//       map.on('contextmenu', stopDrawing)
//     }
//
//     map.on('contextmenu', startDrawing)
//
//     return function cleanup() {
//       map.off('contextmenu', startDrawing)
//     }
//   }, [bounds, context, clearable])
//
//   const clear = () => {
//     map.getSource('draw').setData({
//       type: 'FeatureCollection',
//       features: [],
//     })
//     setClearable(false)
//     onChangeRegion(null)
//   }
//
//   return (
//     <>
//       <canvas
//         ref={canvasRef}
//         className="draw-filter"
//         width={bounds.width}
//         height={bounds.height}
//         style={{
//           position: 'absolute',
//           top: 0,
//           bottom: 0,
//           width: '100%',
//           height: '100%',
//           zIndex: 1,
//           pointerEvents: 'none'
//         }}
//       />
//       <Instructions>
//         <Section>
//           <Box>right-click to start drawing</Box>
//           <Box sx={{ marginY: '8px' }}>AND</Box>
//           <Box sx={{ marginBottom: '2px' }}>click when you're done</Box>
//         </Section>
//         {clearable && (
//           <Section sx={{ padding: '2px' }}>
//             <Button onClick={clear}>
//               clear
//             </Button>
//           </Section>
//         )}
//       </Instructions>
//     </>
//   )
// }
//
// export default DrawFilter
