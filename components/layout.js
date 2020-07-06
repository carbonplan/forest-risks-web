import Seo from './seo'
import Switch from './switch'
import { Container, Flex, Box, Text } from 'theme-ui'

const Layout = ({ children }) => {
  return (
    <>
      <Seo />
      <Flex
        sx={{
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            width: '100%',
            flex: '1 1 auto',
          }}
        >
          {children}
        </Box>
        <Box
          sx={{
            width: '100%',
            position: 'sticky',
            bottom: '0px',
            display: ['none', 'none', 'inherit'],
          }}
        >
          <Box sx={{ px: [4], width: '100%' }}>
            <Switch />
          </Box>
        </Box>
      </Flex>
    </>
  )
}

export default Layout
