import { useRef, useState, useEffect } from 'react'
import { Box } from 'theme-ui'
import Button from './button'
import CircleFilter from './circle-filter'
import FileFilter from './file-filter'
import DrawFilter from './draw-filter'
import ViewportFilter from './viewport-filter'
import { getSelectedData } from './helpers'

export const FILTERS = [
  {
    type: 'Circle',
    Component: CircleFilter,
    label: 'Circle filter',
    svg: (
      <>
        <circle cx='10' cy='10' r='3' />
        <line x1='12' x2='17' y1='12' y2='17' />
      </>
    ),
  },
  {
    type: 'File',
    Component: FileFilter,
    label: 'Upload geojson',
    svg: (
      <>
        <line x1='12' x2='12' y1='7' y2='18' />
        <line x1='12' x2='6' y1='7' y2='12' />
        <line x1='12' x2='18' y1='7' y2='12' />
      </>
    ),
  },
  {
    type: 'Draw',
    Component: DrawFilter,
    label: 'Draw filter',
    svg: (
      <>
        <line x1='12' x2='12' y1='6' y2='18' />
        <line x1='6' x2='18' y1='12' y2='12' />
      </>
    ),
  },
  {
    type: 'Viewport',
    Component: ViewportFilter,
    label: 'No filter',
    svg: null,
  },
]

export function Filters({ map, options, onChangeSelectedData, activeFilter }) {
  const [region, setRegion] = useState(null)

  useEffect(() => {
    const layers = Object.keys(options).filter((key) => options[key])
    const selectedData = getSelectedData(map, layers, region)
    onChangeSelectedData(selectedData)
  }, [options, region])

  return (
    <>
      {FILTERS.map((filter, idx) => {
        const { Component } = filter
        return filter === activeFilter
          ? (
            <Component
              key={idx}
              map={map}
              onChangeRegion={setRegion}
            />
          ) : null
      })}
    </>
  )
}

export function FilterButtons({ activeFilter, onChangeActiveFilter }) {
  const bottom = 68
  const activeFilterPos = (
    FILTERS.length -
    Math.max(FILTERS.indexOf(activeFilter), 0)
  )

  return (
    <>
      {FILTERS.map((filter, idx) => (
        <Button
          key={filter.type}
          svg={filter.svg}
          onClick={() => onChangeActiveFilter(filter)}
          active={filter === activeFilter}
          sx={{
            position: 'absolute',
            left: 12,
            bottom: bottom + (36 * (FILTERS.length - idx)),
            zIndex: 1,
          }}
        />
      ))}
      {/*<Box
        sx={{
          position: 'absolute',
          left: 46,
          bottom: bottom + 12 + (36 * activeFilterPos),
          zIndex: 1,
          borderRadius: '50%',
          width: 8,
          height: 8,
          backgroundColor: 'cyan',
          transition: 'bottom 0.25s',
        }}
      />*/}
    </>
  )
}
