import Head from 'next/head'

const Seo = () => (
  <Head>
    <title>carbonplan</title>
    <meta name='description' content='Data and science for carbon removal.' />
    <meta
      name='viewport'
      content='initial-scale=1.0, minimum-scale=1.0, height=device-height, width=device-width'
    />
    <link rel='canonical' content='https://carbonplan.org/' />
    <link
      rel='icon'
      href='https://carbonplan-assets.s3.amazonaws.com/images/favicon.svg'
    />
    <link
      rel='apple-touch-icon'
      href='https://carbonplan-assets.s3.amazonaws.com/images/favicon.png'
    />
    <meta property='og:title' content='carbonplan' />
    <meta
      property='og:description'
      content='Data and science for carbon removal.'
    />
    <meta
      property='og:image'
      content='https://carbonplan-assets.s3.amazonaws.com/images/social/homepage.png'
    />
    <meta property='og:url' content='https://carbonplan.org' />
    <meta name='twitter:title' content='carbonplan' />
    <meta
      name='twitter:description'
      content='Data and science for carbon removal.'
    />
    <meta
      name='twitter:image'
      content='https://carbonplan-assets.s3.amazonaws.com/images/social/homepage.png'
    />
    <meta name='twitter:card' content='summary_large_image' />
  </Head>
)

export default Seo
