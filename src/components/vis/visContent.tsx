import { Spin } from "antd"
import { useCallback, useEffect, useState } from "react"
import { NetworkConfig, VisContentOptions } from "../../../typings"
import templates from "../templates/templates"
import { genSpecFromLinkTable } from "../templates/genSpec"
import PatternCard from "../xplainer/patternCard"
import useMotifDetect from '../xplainer/useMotifDetect'
import * as d3 from 'd3'
import PatternSelection from "../xplainer/patternSelection"
import { DndProvider, XYCoord, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"


interface IVisContentProps {
  type: string // "explore" || "xplainer"
  viewerId: number
  width: string
  visType: string
  network: string
  options: VisContentOptions
}

function VisContent(props: IVisContentProps) {
  const { viewerId, width, visType, network, options } = props
  const [loading, setLoading] = useState<boolean>(true)
  let viewer: any
  // network data generated from netpan
  const [networkData, setNetworkData] = useState({})
  const [sceneJSON, setSceneJSON] = useState<any>({})
  // rect/lasso selection mouseup position
  const [offsetData, setOffsetData] = useState<[number, number]>([0, 0])
  const [selectType, setSelectType] = useState<string>('rect')
  // current selected motif in the pattern card
  const [currentMotif, setCurrentMotif] = useState('0')

  const containerId = `visSvg${viewerId}`
  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig

  // let onCoordination = (newVal: any) => {
  //   console.log('onCoordination:', visType, { newVal })
  //   // viewers.map(viewer => {
  //   //   propogateSelection(viewer, "node_selection", newVal)
  //   // })
  // }

  // function propogateSelection(viewer: any, selectionName: string, newVal: any) {
  //   // Internally NetPanorma represents selections as an object containing an array of selected node objects, and an array of selected link objectes
  //   // This objects must be nodes/links in the correct network (not just identical copies!)
  //   // If the views we are linking use the same identifiers, then we can link them like this:
  //   // This is a bit inelegant: I might add a new method to NetPanorama in future to make it unnecessary.

  //   const nodeIds = newVal.nodes.map((n: any) => n.id);
  //   const linkIds = newVal.links.map((l: any) => l.id);

  //   const networkName = "network"; // the name of the network in which the selection is made - set in specification
  //   const nodes = viewer.state[networkName].nodes.filter((n: any) => nodeIds.includes(n.id));
  //   const links = viewer.state[networkName].links.filter((l: any) => linkIds.includes(l.id));

  //   viewer.setParam(selectionName, { nodes, links })
  // }

  let motifs = useMotifDetect(networkData, sceneJSON)
  type ParamChangeCallbacks = { [paramName: string]: (newVal: string | number) => void } // refer to netpan
  const getParamCallbacks = () => {
    let cb: ParamChangeCallbacks = {}
    switch (props.type) {
      case 'explore':
        break
      case 'xplainer': 
        cb = { pattern_selection: motifs.detectMotifs }
        break
      default: 
        break
    }
    return cb
  }

  const update = async () => {
    let renderer = visType === 'matrix' ? 'canvas' : 'svg'
    // let renderer = 'svg'
    let template = templates.filter(t => t.key === visType)[0]
    let templatePath = props.type === 'explore' ? `./templates/${template.template}` : `./templates/xplainer/${template.template}`
    let spec: any = genSpecFromLinkTable(networkCfg, visType as string)

    // @ts-ignore
    viewer = await NetPanoramaTemplateViewer.render(templatePath, {
      dataDefinition: JSON.stringify(spec.data),
      networksDefinition: JSON.stringify(spec.network),
      selectType: `"${selectType}"`,
      ...options
    }, containerId, {
      renderer: renderer,
      paramCallbacks: getParamCallbacks()
    })
    // @ts-ignore
    console.log('VIEW STATE:', viewer.state, viewer.sceneJSON)
    // let patternDetector = new PatternDetectors(viewer.state.network)
    setNetworkData(viewer.state.network)
    setSceneJSON(viewer.sceneJSON)

    const container = document.getElementById(containerId)
    if (container && container.getElementsByTagName("svg").length > 0) {
      // @ts-ignore
      container.getElementsByTagName("svg")[0].style["max-width"] = "100%";
      // @ts-ignore
      container.getElementsByTagName("svg")[0].style["max-height"] = "100%";
    }
    setLoading(false)
  }

  useEffect(() => {
    if(selectType !== 'all') {
      const container = document.getElementById(containerId)
      if (!container) {
        console.error(`No container with id ${containerId}`);
        return
      }
      update()
    }
    else {
      motifs.detectMotifs(networkData)
      setOffsetData([1000, 0])
    }
  }, [loading, selectType])

  const handleMouseUp = (event: any) => {
    if (event.target instanceof SVGElement || event.target instanceof HTMLCanvasElement) {
      setOffsetData([event.offsetX, event.offsetY])
    }    
  }

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mouseup", handleMouseUp)
    }
  })

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      setOffsetData([left, top])
    },
    [offsetData, setOffsetData],
  )

  const [, drop] = useDrop(
    () => ({
      accept: 'box',
      drop(item: any, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)
        moveBox(item.id, left, top)
        return undefined
      },
    }),
    [moveBox],
  )

  return (
    <>
      {loading ? 
        <Spin tip="Loading" size="small">
          <div id={containerId} style={{ width: width }} />
          <PatternSelection type={selectType} setType={setSelectType} />
        </Spin> 
        : 
        <>
          <div id={containerId} style={{ width: width }} />
          <PatternSelection type={selectType} setType={setSelectType} />
        </>
      }
      {/* pattern card & overlays */}
      {(props.type === 'xplainer') ? 
      <>
        {motifs.contextHolder}
        <PatternCard
          visType={visType}
          open={motifs.open}
          setOpen={motifs.setOpen}
          motifs={motifs.motifs}
          offset={offsetData}
          currentMotif={currentMotif}
          setCurrentMotif={setCurrentMotif}
        />
        {motifs.open ? <>
          {motifs.motifsBound.map((bounds: any, index: number) => {
            if (!bounds) return
            const offsetX = sceneJSON.items[0].x
            const offsetY = visType !== 'nodelink' ? sceneJSON.items[0].y + 24 : sceneJSON.items[0].y
            return <div 
            key={index}
            style={{
              width: bounds.x2-bounds.x1,
              height: bounds.y2-bounds.y1,
              border: currentMotif === '-1' ? '0.5px solid #E17918' : (index === Number(currentMotif) ? '2px solid #E17918' : '0px'),
              backgroundColor: currentMotif === '-1' ? 'rgba(225, 121, 24, 0.08)'  : (index === Number(currentMotif) ? 'rgba(225, 121, 24, 0.5)' : 'rgba(225, 121, 24, 0)'),
              position: "absolute",
              zIndex: 22,
              transform: `translate(${bounds.x1 + offsetX}px, ${bounds.y1 + offsetY}px)`
            }} />
          })}
        </> : null}
      </> : null}
    </>
  )
}
export default VisContent