import { Box, Text } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import Content from './content.js'

function Methods({ showMethods, toggleMethods }) {
  return (
    <Box
      sx={{
        left: 0,
        position: 'absolute',
        zIndex: 200,
        borderStyle: 'solid',
        borderWidth: 0,
        borderRightWidth: showMethods ? 1 : 0,
        borderColor: 'muted',
        height: '100%',
        left: [
          0,
          'calc(3 * 100vw / 8 + 18px)',
          'calc(3 * 100vw / 12 + 24px)',
          'calc(3 * 100vw / 12 + 36px)',
        ],
        backgroundColor: 'background',
        width: [
          0,
          'calc(4 * 100vw / 8 - 8px)',
          'calc(5 * 100vw / 12 - 12px)',
          'calc(5 * 100vw / 12 - 20px)',
        ],
        transition: 'transform 0.2s',
        transform: showMethods ? 'translateX(0px)' : 'translateX(-100%)',
        overflowY: 'scroll',
        display: ['none', 'initial', 'initial'],
      }}
    >
      <Box
        sx={{
          px: [3, 5, 5, 6],
          opacity: 1,
          pt: ['12px'],
          mb: [4],
        }}
      >
        <Box
          onClick={toggleMethods}
          sx={{
            cursor: 'pointer',
            '&:hover > #arrow': {
              color: 'primary',
            },
            '&:hover > #label': {
              color: 'primary',
            },
          }}
        >
          <Text
            id='arrow'
            sx={{
              display: 'inline-block',
              fontSize: ['20px'],
              color: 'secondary',
              top: '1px',
              mr: [2],
              position: 'relative',
              transition: 'color 0.15s',
            }}
          >
            ←
          </Text>
          <Box
            as='span'
            id='label'
            sx={{
              transition: 'color 0.15s',
              fontSize: [2, 2, 2, 3],
              color: 'secondary',
            }}
          >
            Back
          </Box>
        </Box>
        <Box
          sx={{
            position: 'relative',
            top: '-3px',
          }}
        >
          <Content />
        </Box>
      </Box>
    </Box>
  )
}

export default Methods
