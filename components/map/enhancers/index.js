import useOptions from './use-options'
import useTheme from './use-theme'
import Filters from './filters'
import { RulerButton } from './ruler'
import Switch from '../../switch'

export default function Enhancers({ map, options, onChangeSelectedData }) {
  useTheme(map)
  useOptions(map, options)

  return (
    <>
      <Filters
        map={map}
        options={options}
        onChangeSelectedData={onChangeSelectedData}
      />
      <RulerButton map={map} />
      <Switch />
    </>
  )
}
