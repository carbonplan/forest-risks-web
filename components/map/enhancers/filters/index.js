import { useRef, useState, useEffect } from 'react'
import { Box } from 'theme-ui'
import Button from './button'
import CircleFilter from './circle-filter'
import DrawFilter from './draw-filter'
import { getSelectedData } from './helpers'

const FILTERS = [
  {
    type: 'Circle',
    svg: (
      <>
        <circle cx='10' cy='10' r='3' />
        <line x1='12' x2='17' y1='12' y2='17' />
      </>
    ),
    Component: CircleFilter,
  },
  {
    type: 'File',
    svg: (
      <>
        <line x1='12' x2='12' y1='7' y2='18' />
        <line x1='12' x2='6' y1='7' y2='12' />
        <line x1='12' x2='18' y1='7' y2='12' />
      </>
    ),
    Component: null,
  },
  {
    type: 'Draw',
    svg: (
      <>
        <line x1='12' x2='12' y1='6' y2='18' />
        <line x1='6' x2='18' y1='12' y2='12' />
      </>
    ),
    Component: DrawFilter,
  },
  {
    type: 'Viewport',
    svg: null,
    Component: null,
  },
]

function Filters({ map, options, onChangeSelectedData }) {
  const initialized = useRef(false)

  const [activeFilter, setActiveFilter] = useState(FILTERS[0])
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

  console.log(FILTERS.indexOf(activeFilter))

  const bottom = 68
  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          left: 46,
          bottom: bottom + 12 + (36 * (FILTERS.length - Math.max(FILTERS.indexOf(activeFilter), 0))),
          zIndex: 1,
          borderRadius: '50%',
          width: 8,
          height: 8,
          backgroundColor: 'cyan',
          transition: 'bottom 0.25s',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: 20,
          width: 16,
          bottom: 92,
          height: 1,
          backgroundColor: 'secondary',
          zIndex: 1,
        }}
      />
      {FILTERS.map((filter, idx) => {
        const { Component } = filter
        return (
          <Box key={filter.type}>
            <Button
              svg={filter.svg}
              onClick={() => setActiveFilter(filter)}
              active={activeFilter === filter}
              sx={{
                position: 'absolute',
                left: 12,
                bottom: bottom + (36 * (FILTERS.length - idx)),
                zIndex: 1,
              }}
            />
            {Component && activeFilter === filter && (
              <Component
                map={map}
                onChangeRegion={setRegion}
              />
            )}
          </Box>
        )
      })}
    </>
  )
}

export default Filters
