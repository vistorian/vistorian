import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import templates from '../templates/templates'
import { uniqBy } from 'lodash-es'
import { NetworkConfig } from '../../../typings'
import { genSpecFromLinkTable } from '../templates/genSpec'
import { createUseStyles } from 'react-jss'
import Legend from './legend'
import TimeSlider from './timeslider'
import { defaultColorScheme, defaultNodeTypeShapeScheme } from '../../../typings/constant'
import { timeParse, timeFormat } from 'd3-time-format'
import * as d3 from 'd3'
import { Button } from 'antd'

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
    width: "calc(100% - 320px)"
  }
})

function Vis() {
  const classes = useStyles()
  const { visTypes, network } = useParams()
  const visTypeList = visTypes?.split('+') as string[]
  const preContainer = "visSvg";

  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig
  const data = JSON.parse(window.localStorage.getItem('UPLOADED_FILE_' + networkCfg.linkTableConfig?.file) as string)

  const [colorScheme, setColorScheme] = useState(defaultColorScheme)
  const [nodeTypeShapeScheme, setNodeTypeShapeScheme] = useState(defaultNodeTypeShapeScheme)
  const [nodeLabel, setNodeLabel] = useState<string>(networkCfg.extraNodeConfig?.nodeLabel ? `"datum.data.${networkCfg.extraNodeConfig?.nodeLabel}"` : `"datum.id"`)
  
  const getNodeTypes = () => {
    if (!networkCfg.extraNodeConfig?.hasExtraNode) 
      return 1
    const arr = networkCfg.extraNodeConfig.nodeTypes?.filter(t => t.length > 0)
    if (!arr) return 1
    const nodeData = JSON.parse(window.localStorage.getItem('UPLOADED_FILE_' + networkCfg.extraNodeConfig.file) as string)
    return uniqBy(nodeData, arr[0]).length
  }
  const [nodeTypeInShape, setNodeTypeInShape] = useState<boolean>(networkCfg.linkTableConfig?.linkType?.length as number > 0)

  // respond to time slider
  let minTime = 0, maxTime = 0
  if (networkCfg.linkTableConfig?.withTime) {
    const timeColumn = networkCfg.linkTableConfig?.time as string
    const timeFmt = networkCfg.linkTableConfig?.timeFormat as string
    const timeArray = data.map((d: any) => timeParse(timeFmt)(d[timeColumn])?.getTime())
    minTime = Math.min(...timeArray)
    maxTime = Math.max(...timeArray)
  }
  const [timeRange, setTimeRange] = useState<number[]>([minTime, maxTime])

  const lableImportance = 15

  let viewers: any[] = new Array(visTypeList.length).fill({})

  let onCoordination = (newVal: any) => {
    console.log('onCoordination:', { newVal })
    viewers.map(viewer => {
      propogateSelection(viewer, "node_selection", newVal)
    })
  }

  function propogateSelection(viewer: any, selectionName: string, newVal:any) {
    // Internally NetPanorma represents selections as an object containing an array of selected node objects, and an array of selected link objectes
    // This objects must be nodes/links in the correct network (not just identical copies!)
    // If the views we are linking use the same identifiers, then we can link them like this:
    // This is a bit inelegant: I might add a new method to NetPanorama in future to make it unnecessary.

    const nodeIds = newVal.nodes.map((n: any) => n.id);
    const linkIds = newVal.links.map((l: any) => l.id);

    const networkName = "network"; // the name of the network in which the selection is made - set in specification
    const nodes = viewer.state[networkName].nodes.filter((n: any) => nodeIds.includes(n.id));
    const links = viewer.state[networkName].links.filter((l: any) => linkIds.includes(l.id));

    viewer.setParam(selectionName, { nodes, links })
  }

  // render netpan
  const update = async (containerId: string, visType: string, index: number) => {
    let renderer = visType === 'matrix' ? 'canvas' : 'svg'
    let template = templates.filter(t => t.key === visType)[0]
    let spec: any = genSpecFromLinkTable(networkCfg, visType as string)
      // @ts-ignore
    viewers[index] = await NetPanoramaTemplateViewer.render(`./templates/${template.template}`, {
        dataDefinition: JSON.stringify(spec.data),
        networksDefinition: JSON.stringify(spec.network),
        colorScheme: colorScheme,
        nodeTypeShapeScheme: nodeTypeShapeScheme,
        nodeTypeInShape: nodeTypeInShape,
        nodeLabel: nodeLabel,
        lableImportance: lableImportance,
        timeRange: timeRange
      }, containerId, { 
        renderer: renderer,
        paramCallbacks: { 
          node_selection: onCoordination
        }
      })
      // @ts-ignore
      console.log('Spec:', visType, viewers[index])
      // @ts-ignore
      console.log('VIEW STATE:', visType, viewers[index].state)
      // @ts-ignore
      // const specString = JSON.stringify(window.viewer.spec)
      // @ts-ignore
      // specUrl = "https://netpanorama-editor.netlify.app/?spec=" + encodeURIComponent(specString);
      const container = document.getElementById(containerId)
      if (container && container.getElementsByTagName("svg").length > 0) {
        // @ts-ignore
        container.getElementsByTagName("svg")[0].style["max-width"] = "100%";
        // @ts-ignore
        container.getElementsByTagName("svg")[0].style["max-height"] = "100%";
      }

      // TODO: implement it in netpan
      // const svg = d3.select(`#${containerId}`).select('svg')
      // if (svg) {
      //   let g = svg.select("g").select("g")
      //   // @ts-ignore
      //   svg.call(d3.zoom()
      //     // .extent([[0, 0], [width, height]])
      //     // .scaleExtent([1, 8])
      //     .on("zoom", zoomed));

      //   // @ts-ignore
      //   function zoomed({ transform }) {
      //     g.attr("transform", transform);
      //   }
      // }
  }

  useEffect(() => {
    for (let index: number = 0; index < visTypeList.length; index++) {
      const visType = visTypeList[index]
      const containerId = `${preContainer}${index}`
      const container = document.getElementById(containerId)

      if (!container) {
        console.error(`No container with id ${containerId}`);
        continue
      }
      update(containerId, visType, index)
    }
  })

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
            <Button
              type='primary'
              style={{ marginBottom: 10, marginRight: 10, fontWeight: 700 }}
              onClick={() => { location.href = './#/wizard'; }}
            >
              Return to Network View
            </Button>
            <span style={{ background: '#eee', marginBottom: 3, fontSize: 18 }}><b>Network:</b>&nbsp;{network}</span>
          </div>

          {/* show legends */}
          <Legend 
            config={networkCfg}
            linkTypeEncoding={colorScheme}
            nodeTypeEncoding={nodeTypeInShape ? nodeTypeShapeScheme : colorScheme}
            nodeTypeInShape={nodeTypeInShape}
          />
        </div>
        
        {/* render netpanorama */}
        <div className={classes.right}>
        {networkCfg.linkTableConfig?.withTime ? 
          <TimeSlider 
            network={networkCfg} 
            minTime={minTime} 
            maxTime={maxTime}
            setTimeRange={setTimeRange}
          /> 
          : null}
          <div style={{ width: '100%', display: 'flex'}}>
            {visTypes && visTypes.split('+').map((visType, idx) => {
              const num = visTypes.split('+').length
              return (
                <div id={`${preContainer}${idx}`} key={idx} style={{ width: `${100/num}%` }}></div>
              )
            })}
          </div>
        </div>
    </div>
  )
}

export default Vis