import { useState } from 'react'
import useOptions from './use-options'
import useTheme from './use-theme'
import Toolbar, { Divider } from './toolbar'
import { Filters, FilterButtons, FILTERS } from './filters'
import { RulerButton } from './ruler'
import ThemeButton from '../../switch'

export default function Enhancers({ map, options, onChangeSelectedData }) {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0])

  useTheme(map)
  useOptions(map, options)

  return (
    <>
      <Toolbar map={map}>
        <FilterButtons
          activeFilter={activeFilter}
          onChangeActiveFilter={setActiveFilter}
        />
        <Divider />
        <RulerButton map={map} />
        <ThemeButton />
      </Toolbar>
      <Filters
        map={map}
        options={options}
        onChangeSelectedData={onChangeSelectedData}
        activeFilter={activeFilter}
      />
    </>
  )
}
