
export const INITIAL_CENTER = { lng: -100, lat: 40 }
export const INITIAL_RADIUS = 300
export const INITIAL_ZOOM = 3

/*
Set to true to update the sidebar stats while dragging the circle.
Morphocode does that well, but it's really laggy here because
we need to refilter all of the points every time the mouse moves.
*/
export const UPDATE_STATS_ON_DRAG = false

/*
Set to true to update the sidebar stats when zoom changes.

If true, the sidebar stats are always consistent with the vector source
data (which changes based on zoom level). This solves the problem of
the occasional inconsistency between what you see in the circle and what's
shown in the sidebar. But it creates a different problem: the averages (and
counts) in the sidebar change based on zoom level, which doesn't really
make sense.
*/
export const UPDATE_STATS_ON_ZOOM = true


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
