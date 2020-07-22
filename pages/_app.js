import React from 'react'
import App from 'next/app'
import theme from '../theme'
import { ThemeProvider } from 'theme-ui'
import { Style } from '@carbonplan/components'
import 'mapbox-gl/dist/mapbox-gl.css'

export default ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
      <Style />
    </ThemeProvider>
  )
}
