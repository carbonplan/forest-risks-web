import { useState, useEffect } from 'react'
import { select } from 'd3-selection'
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleOrdinal } from 'd3-scale'
import { ticks } from 'd3-array'
import { jsx, IconButton, useThemeUI } from 'theme-ui'

// ruler modes
const OFF = 0 // show nothing
const AXES = 1 // show axes only
const GRID = 2 // show axes and grid

const TICK_SEPARATION = 150 // target distance between ticks
const TICK_SIZE = 6 // tick length
const TICK_MARGIN = 2 // distance between gridlines and tick text

function useRuler(map, mode = AXES) {
  const context = useThemeUI()
  const theme = context.theme

  useEffect(() => {
    if (mode === OFF) {
      return
    }

    let rulerContainer = null
    let setRulerTicks = null

    function addRuler() {
      const mapContainer = map.getContainer()
      const height = mapContainer.offsetHeight
      const width = mapContainer.offsetWidth
      const numXTicks = width / TICK_SEPARATION
      const numYTicks = height / TICK_SEPARATION

      rulerContainer = select(mapContainer)
        .append('svg')
        .classed('ruler', true)
        .attr('width', width)
        .attr('height', height)
        .style('position', 'absolute')
        .style('top', 0)
        .style('left', 0)
        .style('pointer-events', 'none')

      // x-axis
      const gx = rulerContainer
        .append('g')
        .classed('ruler-axis', true)
        .style('font-size', '14px')
        .style('font-family', theme.fonts.faux)

      const xAxis = (g, x) =>
        g
          .call(axisBottom(x)
              .tickValues(x.domain())
              .tickFormat((d) => `${d}°`)
              .tickSize(TICK_SIZE)
          )
          .call((g) => g.select('.domain').remove())

      // y-axis
      const gy = rulerContainer
        .append('g')
        .classed('ruler-axis', true)
        .attr('transform', `translate(${width},0)`)
        .style('font-size', '14px')
        .style('font-family', theme.fonts.faux)

      const yAxis = (g, y) =>
        g
          .call(axisLeft(y)
              .tickValues(y.domain())
              .tickFormat((d) => `${d}°`)
              .tickSize(TICK_SIZE)
          )
          .call((g) => g.select('.domain').remove())

      // grid
      const { gGrid, grid } =
        mode === GRID
          ? {
              gGrid: rulerContainer
                .append('g')
                .classed('ruler-grid', true)
                .style('stroke', theme.colors.secondary)
                .style('stroke-dasharray', '3,2')
                .style('stroke-opacity', 0.8),

              grid: (g, x, y) => {
                const xTickHeight = gx.node().getBoundingClientRect().height
                const yTickNodes = gy.selectAll('.tick').nodes()
                return g
                  .call((g) =>
                    g
                      .selectAll('.x')
                      .data(x.domain())
                      .join(
                        (enter) =>
                          enter
                            .append('line')
                            .classed('x', true)
                            .attr('y1', xTickHeight + TICK_MARGIN)
                            .attr('y2', height),
                        (update) => update,
                        (exit) => exit.remove()
                      )
                      .attr('x1', (d) => 0.5 + x(d))
                      .attr('x2', (d) => 0.5 + x(d))
                  )
                  .call((g) =>
                    g
                      .selectAll('.y')
                      .data(y.domain())
                      .join(
                        (enter) => enter.append('line').classed('y', true),
                        (update) => update,
                        (exit) => exit.remove()
                      )
                      .attr('y1', (d) => 0.5 + y(d))
                      .attr('y2', (d) => 0.5 + y(d))
                      .attr('x2', (d, i) => {
                        const yTickWidth = yTickNodes[i]
                          ? yTickNodes[i].getBoundingClientRect().width
                          : 0
                        return width - yTickWidth - TICK_MARGIN
                      })
                  )
              },
            }
          : {
              gGrid: null,
              grid: null,
            }

      // the important bit
      setRulerTicks = () => {
        const b = map.getBounds()

        const xDomain = ticks(b.getWest(), b.getEast(), numXTicks)
        const xRange = xDomain.map((lng) => map.project([lng, 0]).x)
        const x = scaleOrdinal().domain(xDomain).range(xRange)

        const yDomain = ticks(b.getNorth(), b.getSouth(), numYTicks)
        const yRange = yDomain.map((lat) => map.project([0, lat]).y)
        const y = scaleOrdinal().domain(yDomain).range(yRange)

        gx.call(xAxis, x)
        gy.call(yAxis, y)
        if (mode === GRID) {
          gGrid.call(grid, x, y)
        }
      }

      setRulerTicks()
      map.on('move', setRulerTicks)
    }

    function removeRuler() {
      if (rulerContainer) {
        rulerContainer.remove()
      }
      if (setRulerTicks) {
        map.off('move', setRulerTicks)
      }
    }

    function resetRuler() {
      removeRuler()
      addRuler()
    }

    addRuler()
    map.on('resize', resetRuler)

    return function cleanup() {
      removeRuler()
      map.off('resize', resetRuler)
    }
  }, [mode, theme])
}

export const RulerButton = ({ map }) => {
  const [mode, setMode] = useState(AXES)

  const switchMode = () => {
    switch (mode) {
      case OFF:
        return setMode(AXES)
      case AXES:
        return setMode(GRID)
      case GRID:
        return setMode(OFF)
    }
  }

  useRuler(map, mode)

  return (
    <IconButton aria-label='Switch ruler mode' onClick={switchMode}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        width='24'
        height='24'
        strokeWidth='1.75'
        fill='none'
      >
        <circle cx='12' cy='12' r='10' />
        <line x1='9' x2='9' y1='2' y2='22' />
        <line x1='15' x2='15' y1='2' y2='22' />
        <line x1='2' x2='22' y1='9' y2='9' />
        <line x1='2' x2='22' y1='15' y2='15' />
      </svg>
    </IconButton>
  )
}
