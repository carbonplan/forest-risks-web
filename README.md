<p align="left" >
<a href='https://carbonplan.org'>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://carbonplan-assets.s3.amazonaws.com/monogram/light-small.png">
  <img alt="CarbonPlan monogram." height="48" src="https://carbonplan-assets.s3.amazonaws.com/monogram/dark-small.png">
</picture>
</a>
</p>

# carbonplan / forest-risks-web

**interactive web-based forest risks mapping tool**

[![CI](https://github.com/carbonplan/forest-risks-web/actions/workflows/main.yml/badge.svg)](https://github.com/carbonplan/forest-risks-web/actions/workflows/main.yml)
![GitHub deployments](https://img.shields.io/github/deployments/carbonplan/forest-risks-web/production?label=vercel)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## building the site

Assuming you already have `Node.js` installed, you can install the build dependencies as:

```shell
npm install .
```

To start a development version of the site, simply run:

```shell
npm run dev
```

and then visit `http://localhost:1000/research/forest-risks` in your browser.

## map tiles

To render the map itself, you need to either build the map tiles locally (so they can be served from the `tile` folder) or update `config.js` to point to the remote versions stored on Google Storage. Building the tiles locally requires

- Python 3
- the Python dependencies specified in `tiles/requirements.txt`
- the command line tools `tippecanoe` `tile-join` and `mb-util`
- several raw files from natural earth

## license

All the code in this repository is [MIT](https://choosealicense.com/licenses/mit/)-licensed, but we request that you please provide attribution if reusing any of our digital content (graphics, logo, articles, etc.).

## about us

CarbonPlan is a nonprofit organization that uses data and science for climate action. We aim to improve the transparency and scientific integrity of carbon removal and climate solutions through open data and tools. Find out more at [carbonplan.org](https://carbonplan.org/) or get in touch by [opening an issue](https://github.com/carbonplan/forest-risks-web/issues/new) or [sending us an email](mailto:hello@carbonplan.org).
