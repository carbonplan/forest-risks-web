import { useState, useCallback } from 'react'
import useOptions from './use-options'
import useTheme from './use-theme'
import Toolbar, { Divider } from './toolbar'
import { Filters, FilterButtons } from './filters'
import { filterTypes } from '@constants'
import { RulerButton } from './ruler'
import ThemeButton from '../../switch'

export default function Enhancers({ map, options, onChangeRegion }) {
  const [activeFilter, setActiveFilter] = useState(filterTypes.CIRCLE)

  useTheme(map)
  useOptions(map, options)

  const handleRegion = useCallback(
    (region) => {
      if (region) region.properties.type = activeFilter
      onChangeRegion(region)
    },
    [activeFilter]
  )

  return (
    <>
      <Toolbar map={map}>
        <FilterButtons
          activeFilter={activeFilter}
          onChangeActiveFilter={setActiveFilter}
        />
        <Divider />
        <RulerButton map={map} />
        <ThemeButton />
      </Toolbar>
      <Filters
        map={map}
        onChangeRegion={handleRegion}
        activeFilter={activeFilter}
      />
    </>
  )
}
