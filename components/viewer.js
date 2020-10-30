import { useState, useEffect } from 'react'
import { Box, Flex } from 'theme-ui'
import Sidebar from './sidebar'
import Map from './map'
import Visualization from './visualization'
import Methods from './methods'
import { filterTypes } from '@constants'
import { getSelectedData } from './map/enhancers/filters/helpers'

function Viewer() {
  const initialOptions = {
    biomass: true,
    fire: true,
    drought: false,
    insects: false,
    biophysical: false,
    scenario: 'SSP2-4.5',
    year: '2020',
  }

  const [map, setMap] = useState(null)
  const [region, setRegion] = useState(null)
  const [bounds, setBounds] = useState(null)
  const [options, setOptions] = useState(initialOptions)
  const [selectedData, setSelectedData] = useState(null)
  const [showMethods, setShowMethods] = useState(false)

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
      }}
    >
      <Sidebar
        options={options}
        setOptions={setOptions}
        showMethods={showMethods}
        toggleMethods={toggleMethods}
      >
        <Visualization data={selectedData} options={options} />
      </Sidebar>
      <Methods showMethods={showMethods} toggleMethods={toggleMethods} />
      <Map options={options} onChangeRegion={setRegion} onMapReady={setMap} />
    </Flex>
  )
}

export default Viewer
