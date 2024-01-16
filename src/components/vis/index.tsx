import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { AllMotifs, NetworkConfig } from '../../../typings'
import { defaultColorScheme, defaultNodeTypeShapeScheme } from '../../../typings/constant'
import { Button, Tooltip } from 'antd'
import { ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import Legend from './legend'
import VisContent from './visContent'
import Overview from '../xplainer/overview'
import ModeSelection from './modeSelection'
import templates from '../templates/templates'
import { Mode } from '../../../typings/status.enum'
import Explainer from '../xplainer'

const useStyles = createUseStyles({
  root: {
    height: '100%',
    width: '100%',
    color: '#333'
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.08)',
    width: '100%',
    marginBottom: 20,
    paddingBottom: 10
  },
  networkTitle: {
    fontSize: '20pt',
    fontWeight: 'bold'
  },
  visTitle: {
    fontSize: '20pt',
    fontWeight: '200'
  },
  left: {
    display: "flex",
    alignItems: "end"
  },
  right: {
    display: "flex",
    alignItems: "end",
    right: '0px'
  }
})

interface IVisProps {
  type: Mode // "explore" || "xplainer"
}

function Vis(props: IVisProps) {
  const classes = useStyles()
  const { visTypes, network } = useParams()
  const visTypeList = visTypes?.split('+') as string[]
  const [viewer1, setViewer1] = useState<any>({})
  const [viewer2, setViewer2] = useState<any>({})

  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig

  const colorScheme = defaultColorScheme
  const nodeTypeShapeScheme = defaultNodeTypeShapeScheme
  const nodeTypeInShape: boolean = networkCfg.linkTableConfig?.linkType?.length as number > 0
  const nodeLabel: string = networkCfg.extraNodeConfig?.nodeLabel ? `"datum.data.${networkCfg.extraNodeConfig?.nodeLabel}"` : `"datum.id"`
  const timeFormat = networkCfg.linkTableConfig?.withTime ? `"${networkCfg.linkTableConfig.timeFormat}"` : null

  let options: any = {
    colorScheme: colorScheme,
    nodeTypeInShape: nodeTypeInShape,
    nodeTypeShapeScheme: nodeTypeShapeScheme,
    nodeLabel: nodeLabel,
    timeFormat: timeFormat,
    // parallelLinksType: parallelLinksType
  }

  // for Pattern Explainer
  const [allMotifs, setAllMotifs] = useState<AllMotifs>({})
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const onPropogate = (viewerId, newVal) => {
    if (visTypeList.length > 1) {
      console.log({ newVal });
      // console.log(viewer1, viewer2);
      propogateSelection(viewerId === 0 ? viewer2 : viewer1, "node_selection", newVal)
    }
  }

  const propogateSelection = (viewer, selectionName, newVal) => {
    // Internally NetPanorma represents selections as an object containing an array of selected node objects, and an array of selected link objectes
    // This objects must be nodes/links in the correct network (not just identical copies!)
    // If the views we are linking use the same identifiers, then we can link them like this:
    // This is a bit inelegant: I might add a new method to NetPanorama in future to make it unnecessary.

    const nodeIds = newVal.nodes.map(n => n.id);
    const linkIds = newVal.links.map(l => l.id);

    const networkName = "network"; // the name of the network in which the selection is made - set in specification
    // console.log("propogateSelection:", viewer, selectionName, newVal)
    const nodes = viewer.state[networkName].nodes.filter(n => nodeIds.includes(n.id));
    const links = viewer.state[networkName].links.filter(l => linkIds.includes(l.id));

    // console.log("after:", nodes)

    viewer.setParam(selectionName, { nodes, links })
  }

  return (
    <div className={classes.root}>
      {/* header */}
      <div className={classes.header}>
        <div className={classes.left}>
          <a href="./" style={{ marginRight: "20px"}}>
            <img src={props.type === Mode.Explainer ? "./logos/logo-xplainer.png" : "./logos/logo-a.png"} style={{ width: 150 }} />
          </a>
          {/* <ModeSelection
            type={props.type}
            visTypes={visTypes as string}
            network={network as string}
          />
        </div>

        {/* network name & data name*/}
        {/* <div className={classes.left}> */}
          {/* show network names */}

          <div style={{ marginRight: 8, marginLeft: 100}}>
            {/* TODO: return to network preview */}
            <span className={classes.networkTitle}>
              {network}
            </span>
            <span className={classes.visTitle}>
            &nbsp;
              {/* |  */}
            &nbsp;
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

          <span style={{paddingLeft: 100}}>
              <Tooltip title="Return to Network View">
                <Link
                  to={`/wizard`}
                  target='_blank'
                >
                  <Button
                    type="text"
                    icon={<ExportOutlined />}
                  >Return to data view</Button>
                </Link>
              </Tooltip>
            </span>
        </div>
      </div>

      {/* render vis */}
      {props.type === Mode.Explorer ? 
        <div style={{ width: '100%', display: 'flex' }}>
          {visTypeList.map((visType, idx) => {
            return (
              <VisContent
                key={idx}
                viewerId={idx}
                viewer={idx === 0 ? viewer1 : viewer2}
                setViewer={idx === 0 ? setViewer1 : setViewer2}
                width={`${100 / visTypeList.length}%`}
                visType={visType}
                network={network as string}
                options={options} // vis encoding 
                onPropogate={onPropogate}
              />
            )
          })}
        </div> 
      : null}

      {/* Pattern Explainer */}
      {props.type === Mode.Explainer ?
        <div style={{width: '100%', display: 'flex'}}>
          <Overview 
            allMotifs={allMotifs}
            setSelectedTypes={setSelectedTypes}
          />
          <Explainer
            type={props.type}
            viewerId={0}
            viewer={viewer1}
            setViewer={setViewer1}
            width={'100%'}
            visType={visTypeList[0]}
            network={network as string}
            options={options}
            onPropogate={onPropogate}
            setAllMotifs={setAllMotifs}
            selectedTypes={selectedTypes}
          />
        </div>
      : null}
    </div>
  )
}

export default Vis