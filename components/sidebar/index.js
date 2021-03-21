import { useState } from 'react'
import { Box, Badge, Text, Flex } from 'theme-ui'
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
}) {
  const [showMenu, setShowMenu] = useState(false)

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
        minWidth: '250px',
        maxWidth: '350px',
        height: '100%',
        flexBasis: '100%',
        flexDirection: 'column',
        borderStyle: 'solid',
        borderWidth: '0px',
        borderRightWidth: '1px',
        borderColor: 'muted',
        zIndex: 2000,
        backgroundColor: 'background',
        display: ['none', 'none', 'flex'],
      }}
    >
      <Header showMenu={showMenu} toggleMenu={() => setShowMenu(!showMenu)} />
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          overflowY: 'scroll',
        }}
      >
        <Menu visible={showMenu} />
        <Layers options={options} setOptions={setOptions}>
          {children}
        </Layers>
        <Box
          onClick={toggleMethods}
          sx={{
            px: [3],
            py: [2],
            pb: [3],
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
          READ MORE<Text sx={sx.arrow}>→</Text>
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar
