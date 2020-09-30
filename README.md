<img
  src='https://carbonplan-assets.s3.amazonaws.com/monogram/dark-small.png'
  height='48'
/>

# carbonplan / maps

**interactive web-based mapping tool**

[![GitHub][github-badge]][github]
![Build Status][]
![MIT License][]

[github]: https://github.com/carbonplan/maps
[github-badge]: https://flat.badgen.net/badge/-/github?icon=github&label
[build status]: https://flat.badgen.net/github/checks/carbonplan/maps
[mit license]: https://flat.badgen.net/badge/license/MIT/blue

## building the site

Assuming you already have `Node.js` installed, you can install the build dependencies as:

```shell
npm install .
```

To start a development version of the site, simply run:

```shell
npm run dev
```

and then visit `http://localhost:1000` in your browser.

## map tiles

To render the map itself, you need to either build the map tiles locally (so they can be served from the `tile` folder) or update `config.js` to point to the remote versions stored on Google Storage. Building the tiles locally requires

- Python 3
- the Python dependencies specified in `tiles/requirements.txt`
- the command line tools `tippecanoe` `tile-join` and `mb-util`
- several raw files from natural earth

## license

All the code in this repository is [MIT](https://choosealicense.com/licenses/mit/) licensed, but we request that you please provide attribution if reusing any of our digital content (graphics, logo, articles, etc.).

## about us

CarbonPlan is a non-profit organization working on the science and data of carbon removal. We aim to improve the transparency and scientific integrity of carbon removal and climate solutions through open data and tools. Find out more at [carbonplan.org](https://carbonplan.org/) or get in touch by [opening an issue](https://github.com/carbonplan/maps/issues/new) or [sending us an email](mailto:hello@carbonplan.org).
