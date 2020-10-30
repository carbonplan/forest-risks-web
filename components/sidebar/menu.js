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
        position: 'fixed',
        width: visible ? '349px' : '250px',
        height: '100%',
        backgroundColor: 'background',
        textAlign: '-webkit-right',
        zIndex: 1000,
        pr: ['22px'],
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
          <Link sx={{ textDecoration: 'none' }} href='https://carbonplan.org/about'>
            <Text sx={link}>About</Text>
          </Link>
          <Link sx={{ textDecoration: 'none' }} href='https://carbonplan.org/reports' sx={link}>
            <Text sx={link}>Reports</Text>
          </Link>
          <Link sx={{ textDecoration: 'none' }} href='https://carbonplan.org/research' sx={link}>
            <Text sx={link}>Research</Text>
          </Link>
          <Link sx={{ textDecoration: 'none' }} href='https://carbonplan.org/team' sx={link}>
            <Text sx={link}>Team</Text>
          </Link>
          <Link sx={{ textDecoration: 'none' }} href='https://carbonplan.org/faq' sx={link}>
            <Text sx={link}>FAQ</Text>
          </Link>
        </Box>
      </Container>
    </Box>
  )
}

export default Menu
