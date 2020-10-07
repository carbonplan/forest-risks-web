export const allOptions = {
  models: ['BCC-CSM2-MR'],
  scenarios: ['SSP4.5', 'SSP7.0', 'SSP8.5'],
  years: ['2020', '2040', '2060', '2080', '2100']
}

export const optionIndex = (label, value) => {
  return allOptions[label].indexOf(value)
}

export const optionKey = (options) => {
  const key = [
    optionIndex('models', options.model), 
    optionIndex('scenarios', options.scenario),
    optionIndex('years', options.year)
  ].join('_')
  return key
}

export const plotRanges = (options) => {
  return {
    fire: {
      'SSP4.5': [0, 15],
      'SSP7.0': [0, 35],
      'SSP8.5': [0, 55],
    }[options['scenario']],
    biomass: [0, 500]
  }
}


export const colorRanges = (options) => {
  return {
    fire: [0, 0.1],
    biomass: [50, 300]
  }
}

export const filterTypes = {
  CIRCLE: 'Circle',
  FILE: 'File',
  DRAW: 'Draw',
  VIEWPORT: 'Viewport',
}

/*
Set to true to deduplicate points when filtering. This addresses mapbox's
caveat about duplication in their docs on queryRenderedFeatures and
querySourceFeatures. (https://docs.mapbox.com/mapbox-gl-js/api/map/#map).

Deduping causes a significant performance hit when the number of points in the
filter region is large. So we should turn it on occassionally just to
see if duplication is actually happening. If it is, there will be a message in
the console.

Based on initial testing, it looks like querySourceFeatures does
duplicate points, but queryRenderedFeatures does not.
*/
export const DEDUPE_ON_FILTER = false

//// CIRCLE FILTER ////

export const FLOATING_HANDLE = true
export const SHOW_RADIUS_GUIDELINE = true
/*
Set to true to update the sidebar stats while dragging the circle.
Morphocode does that well, but it's really laggy here because
we need to refilter all of the points every time the mouse moves.
*/
export const UPDATE_STATS_ON_DRAG = false


