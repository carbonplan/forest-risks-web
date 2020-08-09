import useOptions from './use-options'
import useTheme from './use-theme'
import { RulerButton } from './ruler'
import CircleFilter from './circle-filter'

export default function Enhancers({
  map,
  options,
  onChangeSelectedData,
}) {
  useTheme(map)
  useOptions(map, options)

  return (
    <>
      <RulerButton map={map} />
      <CircleFilter
        map={map}
        options={options}
        onChangeSelectedData={onChangeSelectedData}
      />
    </>
  )
}
