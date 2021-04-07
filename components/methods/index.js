import { Box, Text } from 'theme-ui'
import MethodsContent from './methods.md'

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
          'calc(2 * 100vw / 6 + 18px)',
          'calc(3 * 100vw / 12 + 24px)',
          'min(calc(3 * 100vw / 12 + 36px), 516px)',
        ],
        backgroundColor: 'background',
        width: [
          0,
          'calc(3 * 100vw / 6)',
          'calc(5 * 100vw / 12 - 12px)',
          'min(calc(5 * 100vw / 12 - 18px), 782px)',
        ],
        transition: 'transform 0.2s',
        transform: showMethods
          ? 'translateX(0px)'
          : [
              'translateX(-700px)',
              'translateX(-700px)',
              'translateX(-700px)',
              'translateX(-800px)',
            ],
        overflowY: 'scroll',
        display: ['none', 'initial', 'initial'],
      }}
    >
      <Box
        sx={{
          px: [3, 4, 5, 6],
          opacity: 1,
        }}
      >
        <Box
          onClick={toggleMethods}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              color: 'secondary',
            },
          }}
        >
          <Text
            sx={{
              display: 'inline-block',
              fontSize: [6],
              top: '-3px',
              position: 'relative',
            }}
          >
            ←
          </Text>
        </Box>
        <Box
          sx={{
            position: 'relative',
            top: '-40px',
          }}
        >
          <MethodsContent />
        </Box>
      </Box>
    </Box>
  )
}

export default Methods
