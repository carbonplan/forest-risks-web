import { Box, Badge, Text } from 'theme-ui'
import { alpha } from '@theme-ui/color'

function Main({ options, togglePathway, children }) {
  return (
    <Box>
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
          Forests
        </Text>
        <Text
          sx={{
            fontFamily: 'faux',
            pt: [3],
            pb: [3],
          }}
        >
          Which forest scenario to show
        </Text>
        <Badge
          variant='primary'
          onClick={() => togglePathway('forests')}
          sx={{
            mr: [3],
            color: options['forests'] ? 'green' : alpha('green', 0.2),
            borderColor: options['forests'] ? 'green' : alpha('green', 0.2),
          }}
        >
          Avoided conversion
        </Badge>
      </Box>
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
          FIRES
        </Text>
        <Text
          sx={{
            fontFamily: 'faux',
            pt: [3],
            pb: [3],
          }}
        >
          Which fire scenario to show
        </Text>
        <Badge
          variant='primary'
          onClick={() => togglePathway('fires')}
          sx={{
            mr: [3],
            color: options['fires'] ? 'orange' : alpha('orange', 0.2),
            borderColor: options['fires'] ? 'orange' : alpha('orange', 0.2),
          }}
        >
          Future projection
        </Badge>
      </Box>
      {children}
    </Box>
  )
}

export default Main
