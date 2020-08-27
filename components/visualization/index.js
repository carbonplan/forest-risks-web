import Stats from './stats'
import Histogram from './histogram'

export default function Visualization({ data }) {
  return (
    <>
      {/*<Stats data={data} />*/}
      <Histogram data={data} />
    </>
  )
}
