import { useState, useCallback, useEffect, useRef } from 'react'
import useOptions from './use-options'
import useTheme from './use-theme'
import Toolbar, { Divider } from './toolbar'
import { Filters, FilterButtons } from './filters'
import { filterTypes } from '@constants'
import { RulerButton } from './ruler'
import ThemeButton from '../../switch'
import ResetButton from './reset-button'

export default function Enhancers({ map, options, onChangeRegion }) {
  const [activeFilter, setActiveFilter] = useState(filterTypes.CIRCLE)
  const [reset, setReset] = useState(null)

  useTheme(map)
  useOptions(map, options)

  const handleRegion = useCallback(
    (region) => {
      if (region) region.properties.type = activeFilter
      onChangeRegion(region)
    },
    [activeFilter]
  )

  useEffect(() => setReset(null), [activeFilter])

  return (
    <>
      <Toolbar map={map}>
        {reset && (
          <>
            <ResetButton onClick={() => reset[0]()} />
            <Divider />
          </>
        )}
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
        onChangeReset={(reset) => setReset(reset ? [reset] : null)}
        activeFilter={activeFilter}
      />
    </>
  )
}
