import { useState, useCallback, useEffect, useRef } from 'react'
import useOptions from './use-options'
import useTheme from './use-theme'
import Toolbar, { Divider } from './toolbar'
import { Filters, FilterButtons } from './filters'
import { filterTypes } from '@constants'
import { RulerButton } from './ruler'
import { Dimmer } from '@carbonplan/components'
import ResetButton from './reset-button'

export default function Enhancers({
  map,
  options,
  onChangeRegion,
  setScrollSidebar,
}) {
  const [activeFilter, setActiveFilter] = useState(filterTypes.VIEWPORT)
  const [reset, setReset] = useState([() => {}])

  useTheme(map)
  useOptions(map, options)

  const handleRegion = useCallback(
    (region) => {
      if (region) region.properties.type = activeFilter
      onChangeRegion(region)
    },
    [activeFilter]
  )

  useEffect(() => {
    if (activeFilter == filterTypes.CIRCLE) {
      setScrollSidebar(true)
    } else {
      setScrollSidebar(false)
    }
  }, [activeFilter])

  return (
    <>
      <Toolbar map={map} position={'left'}>
        <FilterButtons
          activeFilter={activeFilter}
          onChangeActiveFilter={setActiveFilter}
        />
        {activeFilter === filterTypes.CIRCLE && (
          <>
            <ResetButton onClick={() => reset[0]()} />
          </>
        )}
      </Toolbar>
      <Toolbar map={map} position={'right'}>
        <RulerButton map={map} />
        <Dimmer />
      </Toolbar>
      <Filters
        map={map}
        onChangeRegion={handleRegion}
        onChangeReset={(reset) => setReset([reset])}
        activeFilter={activeFilter}
      />
    </>
  )
}
