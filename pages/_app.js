import React from 'react'
import theme from '../theme'
import { ThemeProvider } from 'theme-ui'
import { Style } from '@carbonplan/components'
import 'mapbox-gl/dist/mapbox-gl.css'

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
      <Style />
    </ThemeProvider>
  )
}

export default App
