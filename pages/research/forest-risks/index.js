import { Box } from 'theme-ui'
import { Layout, Guide } from '@carbonplan/components'
import Viewer from '../../../components/viewer'

function Index() {
  return (
    <Layout
      description={
          'Mapping risks to forest carbon due to fire, drought, and biotic agents.'
        }
      title='forest risks / research / carbonplan'
      header={false}
      dimmer={false}
      footer={false}
      metadata={false}
    >
      <Guide />
      <Viewer />
    </Layout>
  )
}

export default Index
