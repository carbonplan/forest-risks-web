const style = {
  version: 8,
  sources: {
    ne_10m_land: {
      type: 'vector',
      tiles: ['http://localhost:8080/{z}/{x}/{y}.pbf'],
      maxzoom: 8,
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
      id: 'ne_10m_land',
      type: 'fill',
      source: 'ne_10m_land',
      'source-layer': 'ne_10m_land',
      layout: { visibility: 'visible' },
      paint: {
        'fill-antialias': false,
        'fill-opacity': 0,
        'fill-color': 'black',
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
