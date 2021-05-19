import { Box, Flex } from 'theme-ui'

const Loading = ({ map, mobile = false }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: mobile ? 'calc(100vh - 120px)' : '100%',
        fontFamily: 'mono',
        transition: 'opacity 0.15s',
        opacity: map ? 0 : 1,
        position: 'absolute',
        maxWidth: '1920px',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: [
            '0',
            'calc(2 * 100vw / 6 + 18px)',
            'calc(3 * 100vw / 12 + 24px)',
            'min(calc(3 * 100vw / 12 + 36px), 516px)',
          ],
          width: [
            'calc(100vw)',
            'calc(100vw - (2 * 100vw / 6 + 18px))',
            'calc(100vw - (3 * 100vw / 12 + 24px))',
            'calc(min(1920px, 100vw) - (min(calc(3 * 100vw / 12 + 36px), 516px)))',
          ],
        }}
      >
        <Flex
          sx={{
            justifyContent: 'center',
            lineHeight: 'body',
            alignItems: 'center',
            textTransform: 'uppercase',
            letterSpacing: 'mono',
            height: mobile ? 'calc(100vh - 120px)' : '100vh',
            width: '100%',
            color: 'secondary',
            fontSize: [2, 2, 2, 3],
          }}
        >
          loading map...
        </Flex>
      </Box>
    </Box>
  )
}

export default Loading
