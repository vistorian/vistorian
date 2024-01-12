import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { AllMotifs, NetworkConfig } from '../../../../typings'
import { defaultColorScheme, defaultNodeTypeShapeScheme } from '../../../../typings/constant'
import { timeParse } from 'd3-time-format'
import { Button, Tooltip } from 'antd'
import { ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import Legend from '../legend'
import VisContent from '../visContent'
import Overview from '../../xplainer/overview'
import ModeSelection from '../modeSelection'
import templates from '../../templates/templates'

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
  // let minTime = 0, maxTime = 0
  // if (networkCfg.linkTableConfig?.withTime) {
  //   const timeColumn = networkCfg.linkTableConfig?.time as string
  //   const timeFmt = networkCfg.linkTableConfig?.timeFormat as string
  //   const timeArray = data.map((d: any) => timeParse(timeFmt)(d[timeColumn])?.getTime())
  //   minTime = Math.min(...timeArray)
  //   maxTime = Math.max(...timeArray)
  // }
  // const [timeRange, setTimeRange] = useState<[number, number]>([minTime, maxTime])

  const colorScheme = defaultColorScheme
  const nodeTypeShapeScheme = defaultNodeTypeShapeScheme
  const nodeTypeInShape: boolean = networkCfg.linkTableConfig?.linkType?.length as number > 0
  const nodeLabel: string = networkCfg.extraNodeConfig?.nodeLabel ? `"datum.data.${networkCfg.extraNodeConfig?.nodeLabel}"` : `"datum.id"`
  const timeFormat = networkCfg.linkTableConfig?.withTime ? `"${networkCfg.linkTableConfig.timeFormat}"` : null
  // TODO: temporal solution for user study
  // const parallelLinksType = networkCfg.linkTableConfig?.file === 'marieboucher.csv' ? `"line"` : `"null"`

  let options: any = {
    colorScheme: colorScheme,
    nodeTypeInShape: nodeTypeInShape,
    nodeTypeShapeScheme: nodeTypeShapeScheme,
    nodeLabel: nodeLabel,
    // parallelLinksType: parallelLinksType
  }

  return (
    <div className={classes.root}>
        <div className={classes.left}>
          {/* logo */}
          {/* <div className={classes.header}>
            <a href="./" style={{ marginBottom: "20px", }}>
            <img src={props.type === 'xplainer' ? "./logos/logo-xplainer.png" : "./logos/logo-vistorian.png"} style={{ width: 200 }} />
            </a>
          </div> */}

          <ModeSelection 
            type={props.type}
            visTypes={visTypes as string}
            network={network as string}
          />

        {/* show network names */}
        <div style={{ background: '#eee', marginTop: 10, padding: '0px 5px' , display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          {/* TODO: return to network preview */}
          <span style={{ fontSize: 18 }}>
            <b>Network:</b>&nbsp;{network}
          </span>
          <Tooltip title="Return to Network View">
            <Link
              to={`/wizard`}
              target='_blank'
            >
              <Button
                type="text"
                icon={<ExportOutlined />}
              />
            </Link>
          </Tooltip>
        </div>

        {/* show visualization names */}
        <div style={{ 
            background: '#eee', 
            marginTop: 10, 
            padding: '0px 5px', 
          }}>
          {/* TODO: return to network preview */}
          <span style={{ fontSize: 18 }}>
            <b>Visualization:</b>&nbsp;
            {visTypeList.map((visType: string, index: number) => {
              const item = templates.filter(t => t.key === visType)[0]
              return <span key={index}>
                {item.label}
                <Tooltip title="Jump to Manuals">
                  <Link
                    to={item.manual}
                    target='_blank'
                  >
                    <Button
                      type="text"
                      icon={<QuestionCircleOutlined />}
                    />
                  </Link>
                </Tooltip>
              </span>
            })}
          </span>
        </div>

          {/* show legends */}
          <Legend 
            network={network as string} 
            linkTypeEncoding={colorScheme}
            nodeTypeEncoding={nodeTypeInShape ? nodeTypeShapeScheme : colorScheme}
            nodeTypeInShape={nodeTypeInShape}
          />
          {/* show pattern overview */}
          {props.type === 'xplainer' ? <Overview
            allMotifs={allMotifs}
            setSelectedTypes={setSelectedTypes}
          /> : null}
          
        </div>
        
        {/* render netpanorama */}
        <div className={classes.right}>
          {/* TODO: move timeslider to be inside netpan */}
          {/* {networkCfg.linkTableConfig?.withTime ? 
            <TimeSlider 
              network={network as string} 
              minTime={minTime} 
              maxTime={maxTime}
              setTimeRange={setTimeRange}
            /> 
          : null} */}
          {/* render vis */}
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
        </div>
    </div>
  )
}

export default Vis