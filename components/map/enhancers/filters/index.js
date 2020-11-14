import { filterTypes } from '@constants'
import CircleFilter from './circle-filter'
import ViewportFilter from './viewport-filter'
import Button from './button'

const FILTERS = [
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
