import { useRef, useState, useEffect, useCallback } from 'react'
import { Box } from 'theme-ui'
import Button from './button'
import CircleFilter from './circle-filter'
import FileFilter from './file-filter'
import DrawFilter from './draw-filter'
import ViewportFilter from './viewport-filter'
import { getSelectedData } from './helpers'
import { CIRCLE_STICKS_TO_CENTER, filterTypes } from '@constants'

const FILTERS = [
  {
    type: filterTypes.CIRCLE,
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
    type: filterTypes.FILE,
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
    type: filterTypes.DRAW,
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
    type: filterTypes.VIEWPORT,
    Component: ViewportFilter,
    label: 'No filter',
    svg: null,
  },
]

export function Filters({ map, options, onChangeSelectedData, activeFilter }) {
  const [region, setRegion] = useState(null)
  const [bounds, setBounds] = useState(map.getBounds())

  const handleRegion = useCallback((region) => {
    if (region) region.properties.type = activeFilter
    setRegion(region)
  }, [activeFilter])

  useEffect(() => {
    const layers = Object.keys(options).filter((key) => options[key])
    const selectedData = getSelectedData(map, layers, region)
    onChangeSelectedData(selectedData)
  }, [options, region, bounds])

  useEffect(() => {
    if (
      activeFilter === filterTypes.CIRCLE && CIRCLE_STICKS_TO_CENTER ||
      activeFilter === filterTypes.VIEWPORT
    ) return

    const onMoveEnd = () => setBounds(map.getBounds())
    map.on('moveend', onMoveEnd)
    return function cleanup() {
      map.off('moveend', onMoveEnd)
    }
  }, [activeFilter])

  const { Component } = FILTERS.find(filter => filter.type === activeFilter)

  return (
    <Component
      map={map}
      onChangeRegion={handleRegion}
    />
  )
}

export function FilterButtons({ activeFilter, onChangeActiveFilter }) {
  return FILTERS.map((filter) => (
    <Button
      key={filter.type}
      svg={filter.svg}
      onClick={() => onChangeActiveFilter(filter.type)}
      active={filter.type === activeFilter}
    />
  ))
}
