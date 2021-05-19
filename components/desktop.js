import { useState, useEffect } from 'react'
import { Box, Flex, Container } from 'theme-ui'
import Sidebar from './sidebar'
import Map from './map'
import Visualization from './visualization'
import Methods from './methods'
import Loading from './loading'
import { filterTypes } from '@constants'
import { getSelectedData } from './map/enhancers/filters/helpers'

function Desktop() {
  const initialOptions = {
    biomass: true,
    fire: true,
    drought: false,
    insects: false,
    scenario: 'SSP3-7.0',
    year: '2020',
    displayYear: '2020',
  }

  const [map, setMap] = useState(null)
  const [region, setRegion] = useState(null)
  const [bounds, setBounds] = useState(null)
  const [options, setOptions] = useState(initialOptions)
  const [selectedData, setSelectedData] = useState(null)
  const [showMethods, setShowMethods] = useState(false)
  const [scrollSidebar, setScrollSidebar] = useState(false)

  useEffect(() => {
    if (!map) return
    const data = getSelectedData(
      map,
      ['biomass', 'fire', 'drought', 'insects'],
      region
    )
    setSelectedData(data)
  }, [map, options, region, bounds])

  useEffect(() => {
    if (!map || !region || region.properties.type === filterTypes.VIEWPORT)
      return

    const onMoveEnd = () => setBounds(map.getBounds())
    map.on('moveend', onMoveEnd)
    return function cleanup() {
      map.off('moveend', onMoveEnd)
    }
  }, [map, region])

  const toggleMethods = () => setShowMethods(!showMethods)

  return (
    <Flex
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: ['column', 'row', 'row'],
        overflow: 'hidden',
        maxWidth: '1920px',
        margin: 'auto',
      }}
    >
      <Sidebar
        options={options}
        setOptions={setOptions}
        showMethods={showMethods}
        toggleMethods={toggleMethods}
        scrollSidebar={scrollSidebar}
      >
        <Visualization data={selectedData} options={options} />
      </Sidebar>
      <Methods showMethods={showMethods} toggleMethods={toggleMethods} />
      <Map
        options={options}
        onChangeRegion={setRegion}
        onMapReady={setMap}
        setScrollSidebar={setScrollSidebar}
      />
      <Loading map={map} />
    </Flex>
  )
}

export default Desktop
