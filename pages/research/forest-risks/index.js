import { Box } from 'theme-ui'
import { Layout, Guide } from '@carbonplan/components'
import Viewer from '../../../components/viewer'

function Index() {
  return (
    <Layout
      description={
        'Mapping risks to forest carbon from fire, drought, and insects.'
      }
      title='forest risks / research / carbonplan'
      card='https://images.carbonplan.org/social/forest-risks.png'
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
