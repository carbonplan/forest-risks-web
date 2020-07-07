const style = {
  version: 8,
  sources: {
    combined: {
      type: 'vector',
      tiles: ['http://localhost:8080/{z}/{x}/{y}.pbf'],
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
      source: 'combined',
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
      source: 'combined',
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
      source: 'combined',
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
      source: 'combined',
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
