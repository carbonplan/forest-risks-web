import { Box } from 'theme-ui'
import { Layout } from '@carbonplan/components'

function Index() {
  return (
    <Layout
      title='forest risks / research / carbonplan'
      description='Mapping risks to forest carbon from fire, drought, and insects.'
      header={false}
      footer={false}
      dimmer={false}
      metadata={false}
    >
      <Box>Hello! Please go to /research/forest-risks</Box>
    </Layout>
  )
}

export default Index
