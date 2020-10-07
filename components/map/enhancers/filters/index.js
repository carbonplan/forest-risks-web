import { filterTypes } from '@constants'
import CircleFilter from './circle-filter'
import FileFilter from './file-filter'
import DrawFilter from './draw-filter'
import ViewportFilter from './viewport-filter'
import Button from './button'

const FILTERS = [
  // {
  //   type: filterTypes.DRAW,
  //   Component: DrawFilter,
  //   label: 'Draw filter',
  //   svg: (
  //     <>
  //       <line x1='12' x2='12' y1='6' y2='18' />
  //       <line x1='6' x2='18' y1='12' y2='12' />
  //     </>
  //   ),
  // },
  {
    type: filterTypes.VIEWPORT,
    Component: ViewportFilter,
    label: 'No filter',
    svg: null,
  },
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
  // {
  //   type: filterTypes.FILE,
  //   Component: FileFilter,
  //   label: 'Upload geojson',
  //   svg: (
  //     <>
  //       <line x1='12' x2='12' y1='7' y2='18' />
  //       <line x1='12' x2='6' y1='7' y2='12' />
  //       <line x1='12' x2='18' y1='7' y2='12' />
  //     </>
  //   ),
  // },
]

export function Filters({ map, onChangeRegion, onChangeReset, activeFilter }) {
  const { Component } = FILTERS.find((filter) => filter.type === activeFilter)

  return (
    <Component
      map={map}
      onChangeRegion={onChangeRegion}
      onChangeReset={onChangeReset}
    />
  )
}

export function FilterButtons({ activeFilter, onChangeActiveFilter }) {
  return FILTERS.map((filter) => (
    <Button
      key={filter.type}
      svg={filter.svg}
      label={filter.label}
      onClick={() => onChangeActiveFilter(filter.type)}
      active={filter.type === activeFilter}
    />
  ))
}
