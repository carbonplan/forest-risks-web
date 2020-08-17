import { useRef, useState, useEffect } from 'react'
import CircleButton from './circle-filter/circle-button'
import CircleFilter from './circle-filter'
import { getSelectedData } from './helpers'

function Filters({ map, options, onChangeSelectedData }) {
  const initialized = useRef(false)
  
  const [showCircle, setShowCircle] = useState(true)
  const [bounds, setBounds] = useState(null)
  const [region, setRegion] = useState(null)

  useEffect(() => {
    // skip first run because circle isn't ready yet
    if (!initialized.current) {
      initialized.current = true
      return
    }

    const layers = Object.keys(options).filter((key) => options[key])
    const selectedData = getSelectedData(map, layers, region)
    onChangeSelectedData(selectedData)
  }, [options, region, bounds])

  useEffect(() => {
    if (region) return

    const onMoveEnd = () => setBounds(map.getBounds())
    map.on('moveend', onMoveEnd)
    return function cleanup() {
      map.off('moveend', onMoveEnd)
    }
  }, [region])

  return (
    <>
      <CircleButton
        map={map}
        onClick={() => {
          if (showCircle) setRegion(null)
          setShowCircle(!showCircle)
        }}
      />
      {showCircle && (
        <CircleFilter
          map={map}
          onChangeRegion={setRegion}
        />
      )}
    </>
  )
}

export default Filters
