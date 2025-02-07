const isDev =
  process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview'

const path = require('path')

const resolve = (p) => path.resolve(__dirname, p)

const aliases = {
  '@components': resolve('./components'),
  '@config': resolve('./config'),
  '@constants': resolve('./constants'),
}

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})

module.exports = withMDX({
  pageExtensions: ['jsx', 'js', 'md', 'mdx'],
  assetPrefix: isDev ? '' : 'https://forest-risks.carbonplan.org',
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...aliases,
    }

    return config
  },
})
