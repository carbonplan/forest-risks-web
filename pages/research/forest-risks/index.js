import { useState } from 'react'
import { Box } from 'theme-ui'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { Layout } from '@carbonplan/components'
import Desktop from '../../../components/desktop'
import Mobile from '../../../components/mobile'

function Index() {
  const isWide = useBreakpointIndex() > 0
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      {isWide && (
        <Layout
          description={
            'Mapping climate risks to forest carbon from fire, drought, and insects.'
          }
          title='Forest risks – CarbonPlan'
          card='https://images.carbonplan.org/social/forest-risks.png'
          header={false}
          dimmer={false}
          footer={false}
          metadata={false}
          guide={'teal'}
        >
          <Desktop />
        </Layout>
      )}
      {!isWide && (
        <Box sx={{ display: ['initial', 'none', 'none', 'none'] }}>
          <Layout
            description={
              'Mapping climate risks to forest carbon from fire, drought, and insects.'
            }
            title='Forest risks – CarbonPlan'
            card='https://images.carbonplan.org/social/forest-risks.png'
            header={true}
            nav={'researc'}
            dimmer={true}
            metadata={false}
            footer={false}
            guide={'teal'}
            settings={{
              value: expanded,
              onClick: () => setExpanded(!expanded),
            }}
          >
            <Mobile expanded={expanded} />
          </Layout>
        </Box>
      )}
    </>
  )
}

export default Index
