import { Box, Container, Link, Text } from 'theme-ui'
import { default as NextLink } from 'next/link'
import { Row, Column, Arrow } from '@carbonplan/components'

const link = {
  color: 'text',
  fontSize: [6, 6, 6, 7],
  fontFamily: 'heading',
  letterSpacing: 'heading',
  py: [3, 3, 3, 5],
  borderStyle: 'solid',
  borderColor: 'muted',
  borderWidth: '0px',
  borderBottomWidth: '1px',
  textDecoration: 'none',
  position: 'relative',
  display: 'block',
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover > #arrow': {
      opacity: 1,
    },
  },
  '&:hover': {
    color: 'text',
  },
}

function Menu({ visible }) {
  return (
    <Box
      sx={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        position: 'fixed',
        width: visible
          ? [
              0,
              'calc(3 * 100vw / 8 + 18px - 1px)',
              'calc(3 * 100vw / 12 + 24px - 1px)',
              'calc(3 * 100vw / 12 + 35px)',
            ]
          : [
              0,
              'calc(2 * 100vw / 8 + 18px)',
              'calc(2 * 100vw / 12 + 24px)',
              'calc(2 * 100vw / 12 + 35px)',
            ],
        height: '100%',
        backgroundColor: 'background',
        zIndex: 1000,
        pr: [3, 5, 5, 6],
        pl: [3, 4, 5, 6],
        pt: [5, 5, 5, 6],
        mt: '-12px',
        transition: '0.25s',
      }}
    >
      <Row columns={[3]}>
        <Column start={[1]} width={[3]} sx={{ mt: [5] }}>
          <Link
            sx={{
              ...link,
              borderTopWidth: '1px',
            }}
            href='https://carbonplan.org/about'
          >
            About
          </Link>
          <Link
            sx={{ textDecoration: 'none' }}
            href='https://carbonplan.org/research'
            sx={{
              ...link,
              color: 'secondary',
              '&:hover': {
                color: 'secondary',
              },
            }}
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
        </Column>
      </Row>
    </Box>
  )
}

export default Menu
