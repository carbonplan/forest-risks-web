import { useState } from 'react'
import useOptions from './use-options'
import useTheme from './use-theme'
import { Filters, FilterButtons, FILTERS } from './filters'
import Toolbar, { Divider } from './toolbar'
import { RulerButton } from './ruler'
import Switch from '../../switch'
import { Box } from 'theme-ui'

export default function Enhancers({ map, options, onChangeSelectedData }) {
  const [activeFilter, setActiveFilter] = useState(FILTERS[1])

  useTheme(map)
  useOptions(map, options)

  return (
    <>
      <Filters
        map={map}
        options={options}
        onChangeSelectedData={onChangeSelectedData}
        activeFilter={activeFilter}
      />
      <Toolbar map={map}>
        <FilterButtons
          activeFilter={activeFilter}
          onChangeActiveFilter={setActiveFilter}
        />
        <Divider />
        <RulerButton map={map} />
        <Switch />
      </Toolbar>
    </>
  )
}
