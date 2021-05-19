import { Box } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import { MDXProvider } from '@mdx-js/react'
import Markdown from './methods.md'

const Code = ({ children }) => {
  return (
    <Box
      sx={{
        bg: alpha('muted', 0.5),
        fontFamily: 'mono',
        letterSpacing: 'mono',
        p: [4],
        my: [4],
        borderRadius: '1px',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        whiteSpace: 'break-spaces',
      }}
    >
      {children}
    </Box>
  )
}

const InlineCode = ({ children }) => {
  return (
    <Box
      as='span'
      sx={{
        bg: alpha('muted', 0.5),
        fontSize: [2, 2, 2, 3],
        fontFamily: 'mono',
        letterSpacing: 'mono',
        px: [1],
        borderRadius: '1px',
        display: 'inline-block',
      }}
    >
      {children}
    </Box>
  )
}

const components = {
  code: Code,
  inlineCode: InlineCode,
}

const Content = () => {
  return (
    <MDXProvider components={components}>
      <Markdown />
    </MDXProvider>
  )
}

export default Content
