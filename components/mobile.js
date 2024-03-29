import { useState, useEffect } from 'react'
import { Box, Flex, Grid, Container } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import { Left } from '@carbonplan/icons'
import { Button, Tray, FadeIn } from '@carbonplan/components'
import Map from './map'
import Layers from './sidebar/layers'
import MethodsContent from './methods/content'
import Loading from './loading'

function Mobile({ expanded }) {
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
  const [section, setSection] = useState('map')
  const [options, setOptions] = useState(initialOptions)

  const toggleMethods = () => setShowMethods(!showMethods)

  return (
    <>
      {section === 'map' && (
        <Box
          sx={{
            width: 'calc(100vw)',
            height: 'calc(100vh - 120px)',
            display: 'flex',
            ml: [-3],
          }}
        >
          <Map
            options={options}
            onChangeRegion={() => {}}
            onMapReady={setMap}
            setScrollSidebar={() => {}}
          />
          <Loading map={map} mobile />
        </Box>
      )}
      <Tray
        expanded={expanded}
        sx={{
          pb: [4],
          pt: [5],
          transform: expanded ? 'translateY(0)' : 'translateY(-550px)',
        }}
      >
        <Layers options={options} setOptions={setOptions} />
      </Tray>
      {section === 'methods' && (
        <FadeIn>
          <Box sx={{ mt: [3] }} />
          <Button
            size='xs'
            inverted
            prefix={<Left />}
            onClick={() => setSection('map')}
            sx={{ mt: [1], cursor: 'pointer' }}
          >
            Back
          </Button>

          <MethodsContent />
          <Box sx={{ height: '72px' }} />
        </FadeIn>
      )}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          bg: 'background',
          height: '64px',
          borderStyle: 'solid',
          borderWidth: '0px',
          borderTopWidth: '1px',
          borderColor: 'muted',
          fontSize: [3],
          ml: [-3],
          fontFamily: 'heading',
          letterSpacing: 'allcaps',
          textTransform: 'uppercase',
        }}
      >
        <Grid columns={[2]} gap={[0]}>
          <Flex
            onClick={() => setSection('map')}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '64px',
              borderStyle: 'solid',
              borderColor: 'muted',
              borderWidth: '0px',
              borderLeftWidth: '0px',
              borderRightWidth: '1px',
              cursor: 'pointer',
              bg: section === 'map' ? alpha('muted', 0.5) : 'background',
            }}
          >
            Map
          </Flex>
          <Flex
            onClick={() => setSection('methods')}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '64px',
              cursor: 'pointer',
              bg: section === 'methods' ? alpha('muted', 0.5) : 'background',
            }}
          >
            Methods
          </Flex>
        </Grid>
      </Box>
    </>
  )
}

export default Mobile
