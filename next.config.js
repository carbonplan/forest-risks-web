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

//// EXPORT ////

module.exports = withBundleAnalyzer({
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...aliases,
    }

    return config
  },
})
