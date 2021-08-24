import { Box } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import { MDXProvider } from '@mdx-js/react'
import Markdown from './methods.md'

const Content = () => {
  return (
    <MDXProvider>
      <Markdown />
    </MDXProvider>
  )
}

export default Content
