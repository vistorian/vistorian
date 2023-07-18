import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import templates from '../templates/templates'
import { NetworkConfig } from '../../../typings'
import { genSpecFromLinkTable } from '../templates/genSpec'
import { createUseStyles } from 'react-jss'
import Legend from '../vis/legend'
import TimeSlider from '../vis/timeslider'
import { defaultLinkTypeColorScheme, defaultNodeTypeShapeScheme } from '../../../typings/constant'
import { timeParse } from 'd3-time-format'
import { uniqBy } from 'lodash-es'
import { Button } from 'antd'
import { LinkTuple, PatternDetectors } from "./motifs/patternDetectors";

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

function Xplainer() {
  const classes = useStyles()
  const { visTypes, network } = useParams()
  const visTypeList = visTypes?.split('+') as string[]
  const preContainer = "visSvg"

  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig
  const data = JSON.parse(window.localStorage.getItem('UPLOADED_FILE_' + networkCfg.linkTableConfig?.file) as string)

  const [linkTypeColorScheme, setLinkTypeColorScheme] = useState(defaultLinkTypeColorScheme)
  const [nodeTypeShapeScheme, setNodeTypeShapeScheme] = useState(defaultNodeTypeShapeScheme)

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

  // show labels according to the importance
  const lableImportance = 15

  let viewers: any[] = new Array(visTypeList.length).fill({})

  let detectMotifs = (newVal: any) => {
    console.log('detectMotifs:', newVal)
    // TODO: only allow for one view in Learning Mode
    const networkData = viewers[0].state.network
    let patternDetector = new PatternDetectors({ nodes: networkData.nodes, links: networkData.links })

    let nodes = newVal.nodes
    let links: LinkTuple[] = uniqBy(newVal.links, 'id').map((entry: any) => [entry.source.id, entry.target.id])
    // let nodes = [
    //   'Charles Moruan',
    //   'Marie Boucher et Hubert Antheaume Cie',
    //   'Maude Lequere'
    // ]
    // let links: LinkTuple[] = [["Marie Boucher", "Hubert Antheaume"], ["Marie Boucher", "Maude Lequere"]];
    let motifs = patternDetector.run(nodes, links)
    console.log('motifs:', motifs)
  }

  // render netpan
  const update = async (containerId: string, visType: string, index: number) => {
    let renderer = visType === 'matrix' ? 'canvas' : 'svg'
    let template = templates.filter(t => t.key === visType)[0]
    let spec: any = genSpecFromLinkTable(networkCfg, visType as string)
    // @ts-ignore
    viewers[index] = await NetPanoramaTemplateViewer.render(`./templates/xplainer/${template.template}`, {
      dataDefinition: JSON.stringify(spec.data),
      networksDefinition: JSON.stringify(spec.network),
      linkTypeColorScheme: linkTypeColorScheme,
      nodeTypeShapeScheme: nodeTypeShapeScheme,
      lableImportance: lableImportance,
      timeRange: timeRange
    }, containerId, {
      renderer: renderer,
      paramCallbacks: { rect_selection: detectMotifs }
    })

    const container = document.getElementById(containerId)
    if (container && container.getElementsByTagName("svg").length > 0) {
      // @ts-ignore
      container.getElementsByTagName("svg")[0].style["max-width"] = "100%";
      // @ts-ignore
      container.getElementsByTagName("svg")[0].style["max-height"] = "100%";
    }

    // // TODO: implement it in netpan
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

    // @ts-ignore
    console.log('Spec:', viewers[index].spec)
    // @ts-ignore
    console.log('VIEW STATE:', viewers[index].state)
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
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
          <Link
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
          <span style={{ background: '#eee', marginBottom: 3, fontSize: 18 }}><b>Network:</b>&nbsp;{network}</span>
        </div>

        {/* show legends */}
        <Legend
          config={networkCfg}
          schemes={{ linkType: linkTypeColorScheme, nodeType: nodeTypeShapeScheme }}
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
        <div style={{ width: '100%', display: 'flex' }}>
          {visTypes && visTypes.split('+').map((visType, idx) => {
            const num = visTypes.split('+').length
            return (
              <div id={`${preContainer}${idx}`} key={idx} style={{ width: `${100 / num}%` }}></div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Xplainer