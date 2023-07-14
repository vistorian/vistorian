import { useEffect } from "react"
import noUiSlider from 'nouislider'
import 'nouislider/dist/nouislider.css'
import './timeslider.css'
import { NetworkConfig } from "../../../typings"
import { timeParse, timeFormat } from 'd3-time-format'

interface ITimeSliderProps {
  network: NetworkConfig
  minTime: number
  maxTime: number
  setTimeRange: (tr: number[]) => void
}

function TimeSlider(props: ITimeSliderProps) {
  const { network, minTime, maxTime, setTimeRange } = props

  const timeColumn = network.linkTableConfig?.time as string
  const timeFmt = network.linkTableConfig?.timeFormat as string


  const format = {
    to: function (value: number) {
      return timeFormat(timeFmt)(new Date(value))
    },
    from: function (value: string) {
      return Number(value)
    }
  };

  const update = () => {
    const ele = document.getElementById('timeSliderDiv')
    if (!ele) {
      console.error(`No container with id timeSliderDiv`);
      return;
    }    
    // @ts-ignore
    if (ele.noUiSlider){
      // @ts-ignore
      ele.noUiSlider.destroy()
    }

    noUiSlider.create(ele, {
      start: [minTime, maxTime],
      connect: true,
      tooltips: true,
      format: format,
      behaviour: 'tap-drag',
      range: {
        'min': [minTime],
        'max': [maxTime]
      },
      // @ts-ignore
      pips: { mode: 'count',
        values: 10,
        format: format }
    })
  }

  useEffect(()=>{
    update()
    const ele = document.getElementById('timeSliderDiv')
    // @ts-ignore
    if (ele && ele.noUiSlider) {
      // @ts-ignore
      ele.noUiSlider.on('end', (values, handle, unencoded, tap, positions) => { 
        // console.log('slider', values, unencoded)
        setTimeRange(unencoded)
      })
    }
  }, [])

  return (
    <div style={{ width: '100%', height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div id="timeSliderDiv" style={{ width: `calc(100% - 80px)`, height: 10 }}></div> 
    </div>
    
  )
}

export default TimeSlider