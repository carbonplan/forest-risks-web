const isDev = process.env.NODE_ENV === 'development'

const path = require('path')

//// MODULE ALIASES ////

const resolve = (p) => path.resolve(__dirname, p)

const aliases = {
  '@components': resolve('./components'),
  '@config': resolve('./config'),
  '@constants': resolve('./constants'),
  '@utils': resolve('./utils'),
}

//// BUNDLE ANALYZER ////

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

//// MDX ////

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})

//// EXPORT ////

module.exports = withMDX(
  withBundleAnalyzer({
    pageExtensions: ['jsx', 'js', 'md', 'mdx'],
    assetPrefix: isDev
      ? ''
      : 'https://victorious-sky-0813bc21e.azurestaticapps.net',
    webpack: (config, options) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        ...aliases,
      }

      return config
    },
  })
)
