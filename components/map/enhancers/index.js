import useOptions from './use-options'
import useTheme from './use-theme'
import { RulerButton } from './ruler'
import CircleFilter from './circle-filter'
import UploadFilter from './upload-filter'
import DrawFilter from './draw-filter'
import Filters from './filters'

export default function Enhancers({ map, options, onChangeSelectedData }) {
  useTheme(map)
  useOptions(map, options)

  return (
    <>
      <RulerButton map={map} />
      {/*<CircleFilter
        map={map}
        options={options}
        onChangeSelectedData={onChangeSelectedData}
      />
      <UploadFilter
        map={map}
        options={options}
        onChangeSelectedData={onChangeSelectedData}
      />*/}
      {/*<DrawFilter
        map={map}
        options={options}
        onChangeSelectedData={onChangeSelectedData}
      />*/}
      <Filters
        map={map}
        options={options}
        onChangeSelectedData={onChangeSelectedData}
      />
    </>
  )
}
