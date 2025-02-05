import React from 'react'
import PlausibleProvider from 'next-plausible'
import { ThemeProvider } from 'theme-ui'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@carbonplan/components/globals.css'
import '@carbonplan/components/fonts.css'
import theme from '../theme'

const App = ({ Component, pageProps }) => {
  return (
    <PlausibleProvider domain='carbonplan.org'>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </PlausibleProvider>
  )
}

export default App
