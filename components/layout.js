import { Meta } from '@carbonplan/components'
import { Flex, Box } from 'theme-ui'

const Layout = ({ children }) => {
  return (
    <>
      <Meta
        description={
          'Mapping risks to forest carbon due to fire, drought, and insects.'
        }
        title={'forest risks / research / carbonplan'}
      />
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
      </Flex>
    </>
  )
}

export default Layout
