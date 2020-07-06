import { Box, Badge, Text } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import Header from './header'

function Sidebar({ options, setOptions }) {

  function togglePathway(name) {
    setOptions(options => {
      return {...options, [name]: !options[name]}
    })
  }

  return (
    <Box
      sx={{
        minWidth: '250px',
        maxWidth: '350px',
        height: '100%',
        flexBasis: '100%',
        borderStyle: 'solid',
        borderWidth: '0px',
        borderRightWidth: '1px',
        borderColor: 'muted',
      }}
    >
      <Header></Header>
      <Box
        sx={{
          pl: [3],
          pr: [3],
          pt: [4],
          pb: [4],
          borderStyle: 'solid',
          borderColor: 'muted',
          borderWidth: '0px',
          borderBottomWidth: '1px',
          width: '100%',
        }}
      >
        <Text
          sx={{
            fontFamily: 'heading',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            mb: [2],
          }}
        >
          Pathways
        </Text>
        <Text
          sx={{
            fontFamily: 'faux',
            pt: [3],
            pb: [3],
          }}
        >
          These are different pathways to consider for forest carbon oppurtunities
        </Text>
        <Badge
          variant='primary'
          onClick={() => togglePathway('avoided conversion')}
          sx={{ 
            mr: [3], 
            color: options['avoided conversion'] ? 'yellow' : alpha('yellow', 0.2),
            borderColor: options['avoided conversion'] ? 'yellow' : alpha('yellow', 0.2),
          }}
        >
          Avoided conversion
        </Badge>
        <Badge 
          variant='primary' 
          onClick={() => togglePathway('reforestation')}
          sx={{ 
            color: options['reforestation'] ? 'green' : alpha('green', 0.2),
            borderColor: options['reforestation'] ? 'green' : alpha('green', 0.2),
          }}
        >
          Reforestation
        </Badge>
      </Box>
    </Box>
  )
}

export default Sidebar
