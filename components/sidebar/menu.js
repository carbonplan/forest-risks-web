/** @jsx jsx */
import { jsx, Box, Container, Link, Text } from 'theme-ui'
import { default as NextLink } from 'next/link'

function Menu({ visible }) {
  const link = {
    width: 'fit-content',
    color: 'text',
    fontSize: [5, 5, 6],
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
        position: 'absolute',
        width: visible ? '349px' : '250px',
        height: '100%',
        backgroundColor: 'background',
        textAlign: '-webkit-right',
        zIndex: 1000,
        pr: [3],
        pt: [3],
        transition: '0.25s',
      }}
    >
      <Container>
        <Box
          sx={{
            textAlign: '-webkit-right',
            width: 'fit-content',
            mr: [0],
          }}
        >
          <NextLink href='/about'>
            <a>
              <Text sx={link}>About</Text>
            </a>
          </NextLink>
          <Link href='/reports' sx={link}>
            Reports
          </Link>
          <Link href='/research' sx={link}>
            Research
          </Link>
          <NextLink href='/team'>
            <a>
              <Text sx={link}>Team</Text>
            </a>
          </NextLink>
          <NextLink href='/faq'>
            <a>
              <Text sx={link}>FAQ</Text>
            </a>
          </NextLink>
        </Box>
      </Container>
    </Box>
  )
}

export default Menu
