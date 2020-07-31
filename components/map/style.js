import config from '../../config'

const style = {
  version: 8,
  sources: {
    basemap: {
      type: 'vector',
      tiles: [`${config.basemap}/{z}/{x}/{y}.pbf`],
      maxzoom: 5,
    },
    forests: {
      type: 'vector',
      tiles: [`${config.forests}/{z}/{x}/{y}.pbf`],
      maxzoom: 5,
    },
    fires: {
      type: 'vector',
      tiles: [`${config.fires}/{z}/{x}/{y}.pbf`],
      maxzoom: 5,
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': 'black',
        'background-opacity': 0,
      },
    },
    {
      id: 'land',
      type: 'fill',
      source: 'basemap',
      'source-layer': 'ne_10m_land',
      layout: { visibility: 'visible' },
      paint: {
        'fill-antialias': false,
        'fill-opacity': 0,
        'fill-color': 'black',
      },
    },
    {
      id: 'lakes',
      type: 'fill',
      source: 'basemap',
      'source-layer': 'ne_10m_lakes',
      layout: { visibility: 'visible' },
      paint: {
        'fill-antialias': false,
        'fill-opacity': 0,
        'fill-color': 'black',
      },
    },
    {
      id: 'countries',
      type: 'line',
      source: 'basemap',
      'source-layer': 'ne_10m_admin_0_countries',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        visibility: 'visible',
      },
      paint: {
        'line-blur': 0.4,
        'line-color': 'black',
        'line-opacity': 0,
        'line-width': 0.8,
      },
    },
    {
      id: 'states',
      type: 'line',
      source: 'basemap',
      'source-layer': 'ne_10m_admin_1_states_provinces',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        visibility: 'visible',
      },
      paint: {
        'line-blur': 0.4,
        'line-color': 'black',
        'line-opacity': 0,
        'line-width': 0.8,
      },
    },
    {
      id: 'forests',
      type: 'circle',
      source: 'forests',
      'source-layer': 'forests',
      layout: { visibility: 'visible' },
      paint: {
        'circle-radius': [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          3,
          1.5,
          4,
          1.7,
          5,
          1.75,
          6,
          2,
          7,
          3,
          8,
          5,
        ],
        'circle-color': '#7eb36a',
      },
    },
    {
      id: 'fires',
      type: 'circle',
      source: 'fires',
      'source-layer': 'fires',
      layout: { visibility: 'visible' },
      paint: {
        'circle-radius': [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          3,
          1.5,
          4,
          1.7,
          5,
          1.75,
          6,
          2,
          7,
          3,
          8,
          5,
        ],
        'circle-color': '#ea9755',
      },
    },
  ],
}

export default style

// {
//   id: 'ne_10m_land',
//   type: 'line',
//   source: 'ne_10m_land',
//   'source-layer': 'ne_10m_land',
//   layout: {
//     'line-cap': 'round',
//     'line-join': 'round',
//     visibility: 'visible',
//   },
//   paint: {
//     'line-color': 'black',
//     'line-opacity': 0,
//     'line-width': {
//       base: 1.2,
//       stops: [
//         [13, 1],
//         [20, 10],
//       ],
//     },
//   },
// },
