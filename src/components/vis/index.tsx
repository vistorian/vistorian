import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import templates from '../templates/templates'
import { find } from 'lodash-es'
import { NetworkConfig } from '../../../typings'
import { genSpecFromLinkTable } from '../templates/genSpec'
import { createUseStyles } from 'react-jss'
import Legend from './legend'
import TimeSlider from './timeslider'
import { defaultLinkTypeColorScheme, defaultNodeTypeShapeScheme } from '../../../typings/constant'
import { timeParse, timeFormat } from 'd3-time-format'

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
  const { visType, network } = useParams()
  const containerId = "visSvg";

  const template = find(templates, (tp)=>tp.key === visType)
  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig

  const [linkTypeColorScheme, setLinkTypeColorScheme] = useState(defaultLinkTypeColorScheme)
  const [nodeTypeShapeScheme, setNodeTypeShapeScheme] = useState(defaultNodeTypeShapeScheme)
  const data = JSON.parse(window.localStorage.getItem('UPLOADED_FILE_' + networkCfg.linkTableConfig?.file) as string)

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

  // render netpan
  const update = async () => {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`No container with id ${containerId}`);
      return;
    }

    // decrease rendering time for matrix
    let renderer = visType === 'matrix' ? "canvas" : "svg"

    let spec: any = genSpecFromLinkTable(networkCfg, visType as string, timeRange)
    // @ts-ignore
    window.viewer = await NetPanoramaTemplateViewer.render(`./templates/${template.template}`, {
      dataDefinition: JSON.stringify(spec.data),
      networksDefinition: JSON.stringify(spec.network),
      linkTypeColorScheme: linkTypeColorScheme,
      nodeTypeShapeScheme: nodeTypeShapeScheme,
      lableImportance: lableImportance
    }, containerId, { renderer: renderer })
    // @ts-ignore
    const specString = JSON.stringify(window.viewer.spec)
    // @ts-ignore
    console.log('Spec:', window.viewer.spec)
    // @ts-ignore
    console.log('VIEW STATE:', window.viewer.state)
    // @ts-ignore
    // specUrl = "https://netpanorama-editor.netlify.app/?spec=" + encodeURIComponent(specString);
    // let viewer = new GraphgraView(spec, { container: "#SVG", renderer })
    // await viewer.render();

    // @ts-ignore
    container.getElementsByTagName("svg")[0].style["max-width"] = "100%";
    // @ts-ignore
    container.getElementsByTagName("svg")[0].style["max-height"] = "100%";

    //  return viewer;
  }

  useEffect(() => {
    update()
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
            <span style={{background: '#eee', marginBottom: 3, fontSize: 18}}><b>Network:</b>&nbsp;{network}</span>
            {/* TODO: return to network preview */}
            <Link
              to='./'
              target='_blank'
            >
              Return to Network View
            </Link>
          </div>

          {/* show legends */}
          <Legend 
            config={networkCfg} 
            schemes={{linkType: linkTypeColorScheme, nodeType: nodeTypeShapeScheme}} 
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
          <div id={containerId} style={{ width: '100%' }}></div>
        </div>
    </div>
  )
}

export default Vis