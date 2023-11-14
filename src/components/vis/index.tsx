import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { AllMotifs, NetworkConfig } from '../../../typings'
import { defaultColorScheme, defaultNodeTypeShapeScheme } from '../../../typings/constant'
import { timeParse } from 'd3-time-format'
import { Button, Tooltip } from 'antd'
import { ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import Legend from './legend'
import VisContent from './visContent'
import Overview from '../xplainer/overview'
import ModeSelection from './modeSelection'
import templates from '../templates/templates'

const useStyles = createUseStyles({
  root: {
    height: '100%',
    width: '100%'
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.08)',
    marginBottom: 20,
    paddingBottom: 10
  },
  left: {
    display: "flex",
    alignItems: "end"
  },
  right: {
    display: "flex",
    alignItems: "end"
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
  // const data = JSON.parse(window.localStorage.getItem('UPLOADED_FILE_' + networkCfg.linkTableConfig?.file) as string)
  
  // for PatternOverview Component
  const [allMotifs, setAllMotifs] = useState<AllMotifs>({})
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

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
    timeFormat: timeFormat,
    // parallelLinksType: parallelLinksType
  }

  return (
    <div className={classes.root}>
      {/* header */}
      <div className={classes.header}>
        <div className={classes.left}>
          <a href="./" style={{ marginRight: "20px"}}>
            <img src={props.type === 'xplainer' ? "./logos/logo-xplainer.png" : "./logos/logo-vistorian.png"} style={{ width: 150 }} />
          </a>
          <ModeSelection
            type={props.type}
            visTypes={visTypes as string}
            network={network as string}
          />
        </div>
        {/* network name & data name*/}
        <div className={classes.right}>
          {/* show network names */}
          <div style={{ marginRight: 8}}>
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
          <div>
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
        </div>
      </div>

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
  )
}

export default Vis