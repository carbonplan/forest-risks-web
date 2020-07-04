import React from 'react'
import App from 'next/app'
import theme from '@carbonplan/theme'
import { ThemeProvider } from 'theme-ui'
import { Style } from '@carbonplan/components'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        <Style/>       
      </ThemeProvider>
    )
  }
}

export default MyApp
