const style = {
  "version": 8,
  "sources": {
    "california": {
      "type": "vector",
      "tiles": ["http://localhost:8080/{z}/{x}/{y}.pbf"],
      "maxzoom": 14
    }
  },
  "layers": 
  [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": 'black',
        'background-opacity': 0
      }
    },
    {
      "id": "water",
      "type": "fill",
      "source": "california",
      "source-layer": "water",
      "layout": {"visibility": "visible"},
      "paint": {
        "fill-antialias": true, 
        "fill-color": 'black',
        'fill-opacity': 0
      }
    },
  ]
}

export default style