import { useState } from 'react'
import { Box, Badge, Text, Flex } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import Header from './header'
import Menu from './menu'
import Main from './main'

function Sidebar({ options, setOptions, children }) {
  const [showMenu, setShowMenu] = useState(false)

  function togglePathway(name) {
    setOptions((options) => {
      return { ...options, [name]: !options[name] }
    })
  }

  return (
    <Flex
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
      }}
    >
      <Header showMenu={showMenu} toggleMenu={() => setShowMenu(!showMenu)} />
      <Box sx={{ position: 'relative' }}>
        <Menu visible={showMenu} />
        <Main options={options} togglePathway={togglePathway}>
          {children}
        </Main>
      </Box>
    </Flex>
  )
}

export default Sidebar
