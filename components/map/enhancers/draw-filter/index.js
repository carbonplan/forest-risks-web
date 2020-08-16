import { useRef, useState, useEffect } from 'react'
import * as turf from '@turf/turf'
import { getSelectedData } from '../circle-filter/helpers'

function addPointsToMap(map, points, options, onChangeSelectedData) {
  const linearRing = points.map(p => map.unproject(p).toArray())
  linearRing.push(linearRing[0])

  // avoid error about linear ring needing at least 4 positions
  if (linearRing.length < 4) return

  const region = turf.polygon([linearRing], {
    type: 'Drawn',
  })

  let source = map.getSource('draw')

  if (source)
    source.setData(region)
  else
    map.addSource('draw', {
      type: 'geojson',
      data: region,
    })

  if (!map.getLayer('draw/line'))
    map.addLayer({
      id: 'draw/line',
      source: 'draw',
      type: 'line',
      paint: {
        'line-width': 3.0,
        'line-color': '#FFFFFF',
      },
    })

  const layers = Object.keys(options).filter((key) => options[key])
  const selectedData = getSelectedData(map, layers, region)
  onChangeSelectedData(selectedData)

  // var tab = window.open('about:blank', '_blank');
  // tab.document.write('<html><body><pre>' + JSON.stringify(region, null, 2) + '</pre></body></html>');
  // tab.document.close();
}

function DrawFilter({ map, options, onChangeSelectedData }) {
  const canvasRef = useRef(null)
  const { width, height } = map.getContainer().getBoundingClientRect()

  useEffect(() => {
    // https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
    const ctx = canvasRef.current.getContext('2d')

    let drawing = false
    let pos = { x: 0, y: 0 }
    let points = []

    canvasRef.current.addEventListener('mousedown', (e) => {
      setPosition(e)
      canvasRef.current.addEventListener('mousemove', draw)
    });

    canvasRef.current.addEventListener('mouseup', () => {
      canvasRef.current.removeEventListener('mousemove', draw)
      addPointsToMap(map, points, options, onChangeSelectedData)
      ctx.clearRect(0, 0, width, height)
      points = []
    })

    function setPosition(e) {
      pos.x = e.offsetX;
      pos.y = e.offsetY;
      points.push({ ...pos })
    }

    function draw(e) {
      // if (!drawing) return
      // mouse left button must be pressed
      if (e.buttons !== 1) return;

      ctx.beginPath(); // begin

      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'red';

      ctx.moveTo(pos.x, pos.y); // from
      setPosition(e);
      ctx.lineTo(pos.x, pos.y); // to

      ctx.stroke(); // draw it!
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
      }}
    />
  )
}

export default DrawFilter
