import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { AllMotifs, NetworkConfig, VisContentOptions } from '../../../typings'
import { createUseStyles } from 'react-jss'
import Legend from './legend'
import TimeSlider from './timeslider'
import { defaultColorScheme, defaultNodeTypeShapeScheme } from '../../../typings/constant'
import { timeParse } from 'd3-time-format'
import { Button } from 'antd'
import VisContent from './visContent'
// import { DndProvider } from 'react-dnd'
// import { HTML5Backend } from 'react-dnd-html5-backend'
import Overview from '../xplainer/overview'

const useStyles = createUseStyles({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    height: '100%',
  },
  left: {
    width: 280,
    height: '100%',
    borderRight: '1px solid #d9d9d9',
    marginRight: 20,
    paddingRight: 20
  },
  header: {
    display: "flex",
    flexDirection: "column",
  },
  right: {
    width: "calc(100% - 352px)"
  }
})

interface IVisProps {
  type: string // "explore" || "xplainer"
}

function Vis(props: IVisProps) {
  const classes = useStyles()
  const { visTypes, network } = useParams()
  const visTypeList = visTypes?.split('+') as string[]

  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig
  const data = JSON.parse(window.localStorage.getItem('UPLOADED_FILE_' + networkCfg.linkTableConfig?.file) as string)
  // for PatternOverview Component
  const [allMotifs, setAllMotifs] = useState<AllMotifs>({})
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  // respond to time slider
  let minTime = 0, maxTime = 0
  if (networkCfg.linkTableConfig?.withTime) {
    const timeColumn = networkCfg.linkTableConfig?.time as string
    const timeFmt = networkCfg.linkTableConfig?.timeFormat as string
    const timeArray = data.map((d: any) => timeParse(timeFmt)(d[timeColumn])?.getTime())
    minTime = Math.min(...timeArray)
    maxTime = Math.max(...timeArray)
  }
  const [timeRange, setTimeRange] = useState<[number, number]>([minTime, maxTime])

  const colorScheme = defaultColorScheme
  const nodeTypeShapeScheme = defaultNodeTypeShapeScheme
  const nodeTypeInShape: boolean = networkCfg.linkTableConfig?.linkType?.length as number > 0
  const nodeLabel: string = networkCfg.extraNodeConfig?.nodeLabel ? `"datum.data.${networkCfg.extraNodeConfig?.nodeLabel}"` : `"datum.id"`
  const lableImportance = 15
  const timeFormat = networkCfg.linkTableConfig?.withTime ? `"${networkCfg.linkTableConfig.timeFormat}"` : null
  // TODO: temporal solution for user study
  const parallelLinksType = networkCfg.linkTableConfig?.file === 'marieboucher.csv' ? `"line"` : `"null"`

  let options: VisContentOptions = {
    timeRange: timeRange,
    colorScheme: colorScheme,
    nodeTypeInShape: nodeTypeInShape,
    nodeTypeShapeScheme: nodeTypeShapeScheme,
    nodeLabel: nodeLabel,
    lableImportance: lableImportance,
    timeFormat: timeFormat,
    parallelLinksType: parallelLinksType
  }

  const modeBtnRender = () => {
    switch(props.type) {
      case 'explore': 
        return <Link
          to={`/vis/${visTypes}/network/${network}/xplainer`}
          target='_blank'
          style={{ marginRight: 10, marginBottom: 10 }}
        >
          <Button
            type='primary'
            style={{ width: '100%', fontWeight: 700 }}
          >
            Jump to Learning Mode
          </Button>
        </Link>
      case 'xplainer': 
        return <Link
          to={`/vis/${visTypes}/network/${network}`}
          target='_blank'
          style={{ marginRight: 10, marginBottom: 10 }}
        >
          <Button
            type='primary'
            style={{ width: '100%', fontWeight: 700 }}
          >
            Jump to Exploration Mode
          </Button>
        </Link>
      default:
        return <></>
    }
  }

  return (
    <div className={classes.root}>
        <div className={classes.left}>
          <div className={classes.header}>
            <a href="./" style={{ marginBottom: "20px", }}>
              <img src="./logos/logo-vistorian.png" style={{ width: 200 }} />
            </a>
          </div>
          
          {/* show network names */}
          <div style={{ display: 'flex', flexDirection: 'column'}}>
          {/* TODO: return to network preview */}
            <Link
              to={`./#/wizard`}
              target='_blank'
              style={{ marginRight: 10, marginBottom: 10 }}
            >
              <Button
                type='primary'
                style={{ width: '100%', fontWeight: 700 }}
              >
                Return to Network View
              </Button>
            </Link>
            {modeBtnRender()}
            <span style={{ background: '#eee', marginBottom: 3, fontSize: 18 }}><b>Network:</b>&nbsp;{network}</span>
          </div>

          {/* show legends */}
          <Legend 
            network={network as string} 
            linkTypeEncoding={colorScheme}
            nodeTypeEncoding={nodeTypeInShape ? nodeTypeShapeScheme : colorScheme}
            nodeTypeInShape={nodeTypeInShape}
          />
          <Overview 
            allMotifs={allMotifs}
            setSelectedTypes={setSelectedTypes}
          />
        </div>
        
        {/* render netpanorama */}
        <div className={classes.right}>
          {networkCfg.linkTableConfig?.withTime ? 
            <TimeSlider 
              network={network as string} 
              minTime={minTime} 
              maxTime={maxTime}
              setTimeRange={setTimeRange}
            /> 
          : null}
          {/* render vis */}
          {/* <DndProvider backend={HTML5Backend}> */}
            <div style={{ width: '100%', display: 'flex' }}>
              {visTypeList.map((visType, idx) => {
                return (
                  <VisContent
                    type={props.type}
                    key={idx}
                    viewerId={idx}
                    width={`${100 / visTypeList.length}%`}
                    visType={visType}
                    network={network as string}
                    options={options}
                    setAllMotifs={setAllMotifs}
                    selectedTypes={selectedTypes}
                  />
                )
              })}
            </div>
          {/* </DndProvider> */}
        </div>
    </div>
  )
}

export default Vis