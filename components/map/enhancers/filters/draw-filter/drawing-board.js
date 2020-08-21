// https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse

import { useRef, useEffect } from 'react'

function DrawingBoard({ map, lineColor, startingPoint, onComplete }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.strokeStyle = lineColor

    let pos
    let points = []

    const setPosition = ({ offsetX: x, offsetY: y }) => {
      pos = { x, y }
      points.push({ x, y })
    }

    const lineTo = e => {
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
      setPosition(e)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }

    const stopDrawing = e => {
      e.preventDefault()
      canvasRef.current.removeEventListener('mousemove', lineTo)
      lineTo(startingPoint)
      onComplete(points)
    }

    setPosition(startingPoint)
    canvasRef.current.addEventListener('mousemove', lineTo)
    canvasRef.current.addEventListener('click', stopDrawing, { once: true })
    canvasRef.current.addEventListener('contextmenu', stopDrawing, { once: true })
  }, [])

  const { width, height } = map.getCanvas().style

  return (
    <canvas
      ref={canvasRef}
      className="drawing-board"
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        cursor: 'crosshair',
      }}
    />
  )
}

export default DrawingBoard
