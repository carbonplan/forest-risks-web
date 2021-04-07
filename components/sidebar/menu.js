import { Box, Container, Link, Text } from 'theme-ui'
import { default as NextLink } from 'next/link'

function Menu({ visible }) {
  const link = {
    width: 'fit-content',
    color: 'text',
    fontSize: [5, 5, 6, 7],
    pb: [0],
    textDecoration: 'none',
    display: 'block',
    '&:hover': {
      color: 'secondary',
      borderBottomWidth: '1px',
      borderColor: 'secondary',
    },
  }

  return (
    <Box
      sx={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        position: 'fixed',
        width: visible
          ? [
              0,
              'calc(2 * 100vw / 6 + 18px - 1px)',
              'calc(3 * 100vw / 12 + 24px - 1px)',
              'min(calc(3 * 100vw / 12 + 36px), 516px)',
            ]
          : [
              0,
              'calc(1 * 100vw / 6 + 18px)',
              'calc(2 * 100vw / 12 + 24px)',
              'min(calc(2 * 100vw / 12 + 36px), 516px)',
            ],
        height: '100%',
        backgroundColor: 'background',
        textAlign: '-webkit-right',
        zIndex: 1000,
        pr: [3, 4, 5, 6],
        pt: [3],
        transition: '0.25s',
      }}
    >
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', right: 0 }}>
          <Link sx={link} href='https://carbonplan.org/about'>
            About
          </Link>
          <Link
            sx={{ textDecoration: 'none' }}
            href='https://carbonplan.org/research'
            sx={link}
          >
            Research
          </Link>
          <Link
            sx={{ textDecoration: 'none' }}
            href='https://carbonplan.org/team'
            sx={link}
          >
            Team
          </Link>
          <Link
            sx={{ textDecoration: 'none' }}
            href='https://carbonplan.org/faq'
            sx={link}
          >
            FAQ
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default Menu
