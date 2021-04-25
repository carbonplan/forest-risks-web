import { useState, useEffect } from 'react'
import { Box, Badge, Text, Flex, Link } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import Header from './header'
import Menu from './menu'
import Layers from './layers'

function Sidebar({
  options,
  setOptions,
  showMethods,
  toggleMethods,
  children,
  scrollSidebar,
}) {
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (scrollSidebar) {
      setTimeout(() => {
        const el = document.getElementById('sidebar')
        if (!el) return
        el.scrollTo({
          top: 1000,
          left: 0,
          behavior: 'smooth',
        })
      }, 100)
    } else {
      setTimeout(() => {
        const el = document.getElementById('sidebar')
        if (!el) return
        el.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        })
      }, 0)
    }
  }, [scrollSidebar])

  const sx = {
    arrow: {
      display: 'inline-block',
      fontSize: [4],
      ml: [2],
      top: '3px',
      position: 'relative',
      transition: 'transform 0.2s',
      transform: showMethods ? 'scaleX(-1)' : 'scaleX(1)',
    },
  }

  return (
    <Box
      sx={{
        maxWidth: [
          0,
          'calc(3 * 100vw / 8 + 18px)',
          'calc(3 * 100vw / 12 + 24px)',
          'min(calc(3 * 100vw / 12 + 36px), 516px)',
        ],
        height: '100%',
        flexBasis: '100%',
        flexDirection: 'column',
        borderStyle: 'solid',
        borderWidth: '0px',
        borderRightWidth: '1px',
        borderColor: 'muted',
        zIndex: 900,
        backgroundColor: 'background',
        display: ['none', 'flex', 'flex'],
      }}
    >
      <Header showMenu={showMenu} toggleMenu={() => setShowMenu(!showMenu)} />
      <Box
        id='sidebar'
        sx={{
          position: 'relative',
          flex: 1,
          overflowY: 'scroll',
        }}
      >
        <Menu visible={showMenu} />
        <Box
          sx={{
            borderStyle: 'solid',
            borderColor: 'muted',
            borderWidth: '0px',
            borderBottomWidth: '1px',
          }}
        >
          <Box
            sx={{
              px: [3, 4, 5, 6],
              pt: [3],
              pb: [3],
              fontSize: [6, 6, 6, 7],
              width: 'fit-content',
              fontFamily: 'heading',
              lineHeight: 'heading',
            }}
          >
            Forest risks
          </Box>
          <Box
            sx={{
              px: [3, 4, 5, 6],
              pt: [0],
              pb: [4],
              mb: [1],
              fontSize: [2, 2, 2, 3],
              fontFamily: 'body',
              lineHeight: 'body',
            }}
          >
            This map shows harmonized projections of risks to forest carbon from
            fire, drought, and insects under a changing climate. Results are
            preliminary and models are still in{' '}
            <Link href='https://github.com/carbonplan/forest-risks'>
              development
            </Link>
            .
          </Box>
        </Box>
        <Layers options={options} setOptions={setOptions}>
          {children}
        </Layers>
        <Box
          onClick={toggleMethods}
          sx={{
            mx: [3, 4, 5, 6],
            pt: [1],
            mt: ['12px'],
            pb: [2],
            mb: [3],
            fontSize: [2, 2, 2, 3],
            width: 'fit-content',
            fontFamily: 'heading',
            letterSpacing: 'smallcaps',
            textTransform: 'uppercase',
            cursor: 'pointer',
            '&:hover': {
              color: 'secondary',
            },
          }}
        >
          READ METHODS<Text sx={sx.arrow}>→</Text>
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar
