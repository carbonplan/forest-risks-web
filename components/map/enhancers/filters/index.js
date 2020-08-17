import { useRef, useState, useEffect } from 'react'
import Button from './button'
import CircleFilter from './circle-filter'
import DrawFilter from './draw-filter'
import { getSelectedData } from './helpers'

const FILTERS = {

  circle: {
    type: 'Circle',
    svg: (
      <>
        <circle cx='10' cy='10' r='3' />
        <line x1='12' x2='17' y1='12' y2='17' />
      </>
    ),
    Component: CircleFilter,
  },
  file: {
    type: 'File',
    svg: (
      <>
        <circle cx='10' cy='10' r='3' />
        <line x1='12' x2='17' y1='12' y2='17' />
      </>
    ),
    Component: null,
  },
  draw: {
    type: 'Draw',
    svg: (
      <>
        <circle cx='10' cy='10' r='3' />
        <line x1='12' x2='17' y1='12' y2='17' />
      </>
    ),
    Component: DrawFilter,
  },
  viewport: {
    type: 'Viewport',
    svg: null,
    Component: null,
  },
}

function Filters({ map, options, onChangeSelectedData }) {
  const initialized = useRef(false)

  const [activeFilter, setActiveFilter] = useState(FILTERS.circle)
  const [region, setRegion] = useState(null)
  const [bounds, setBounds] = useState(null)

  useEffect(() => {
    // skip first run because circle isn't ready yet
    if (!initialized.current) {
      initialized.current = true
      return
    }

    const layers = Object.keys(options).filter((key) => options[key])
    const selectedData = getSelectedData(map, layers, region)
    onChangeSelectedData(selectedData)
  }, [options, region, bounds])

  useEffect(() => {
    if (region) return

    const onMoveEnd = () => setBounds(map.getBounds())
    map.on('moveend', onMoveEnd)
    return function cleanup() {
      map.off('moveend', onMoveEnd)
    }
  }, [region])

  return Object.keys(FILTERS).map((key, idx) => {
    const { Component } = FILTERS[key]
    return (
      <>
        <Button
          key={key}
          svg={FILTERS[key].svg}
          onClick={() => setActiveFilter(FILTERS[key])}
          active={activeFilter === FILTERS[key]}
          sx={{
            position: 'absolute',
            left: 12,
            bottom: 12 + (36 * (Object.keys(FILTERS).length - idx)),
            zIndex: 1,
          }}
        />
        {Component && activeFilter === FILTERS[key] && (
          <Component
            map={map}
            onChangeRegion={setRegion}
          />
        )}
      </>
    )
  })
}

export default Filters
