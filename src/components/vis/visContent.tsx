import { Spin } from "antd"
import { useCallback, useEffect, useState } from "react"
import { AllMotifs, NetworkConfig, VisContentOptions } from "../../../typings"
import templates from "../templates/templates"
import { genSpecFromLinkTable } from "../templates/genSpec"
import useMotifDetect from '../xplainer/useMotifDetect'
import * as d3 from 'd3'
import PatternSelection from "../xplainer/patternSelection"
import { XYCoord, useDrop } from "react-dnd"
import { PatternDetectors } from "../xplainer/motifs/patternDetectors"
import Xplainer from "../xplainer"


interface IVisContentProps {
  type: string // "explore" || "xplainer"
  viewerId: number
  width: string
  visType: string
  network: string
  options: VisContentOptions
  setAllMotifs: (m: AllMotifs) => void
  showAll: boolean
}

function VisContent(props: IVisContentProps) {
  const { viewerId, width, visType, network, options, setAllMotifs } = props
  const [loading, setLoading] = useState<boolean>(true)
  let viewer: any
  // network data generated from netpan
  // const [networkData, setNetworkData] = useState({})
  const [sceneJSON, setSceneJSON] = useState<any>({})
  const [patternDetector, setPatternDetector] = useState<any>({})
  // rect/lasso selection mouseup position
  const [offsetData, setOffsetData] = useState<[number, number]>([0, 0])
  const [selectType, setSelectType] = useState<string>('rect')
  // current selected motif in the pattern card

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

  let motifs = useMotifDetect(sceneJSON, patternDetector)
  type ParamChangeCallbacks = { [paramName: string]: (newVal: string | number) => void } // refer to netpan
  const getParamCallbacks = () => {
    let cb: ParamChangeCallbacks = {}
    switch (props.type) {
      case 'explore':
        break
      case 'xplainer': 
        cb = { 
          pattern_selection: motifs.detectMotifs
        }
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
    let tmpPatternDetector = new PatternDetectors(viewer.state.network)
    // console.log('patternDetector', patternDetector.allMotifs)
    // setNetworkData(viewer.state.network)
    setSceneJSON(viewer.sceneJSON)
    setPatternDetector(tmpPatternDetector)
    setAllMotifs(patternDetector.allMotifs)

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
    const container = document.getElementById(containerId)
    if (!container) {
      console.error(`No container with id ${containerId}`);
      return
    }
    update()
  }, [loading, selectType])

  // show all motifs bounds above vis
  useEffect(() => {
    if (props.showAll && patternDetector && Object.keys(patternDetector).length > 0) {
      motifs.detectMotifs(patternDetector.network)
    }
  }, [props.showAll])

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
  }, [])

  // drag pattern card
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
        <div 
          ref={drop}  
          style={{position: 'relative'}}
        >
          <div id={containerId} style={{ width: width }} />
          <PatternSelection type={selectType} setType={setSelectType} />
        </div>
      }
      {/* pattern card & overlays */}
      {(props.type === 'xplainer' && Object.keys(patternDetector).length>0) ? 
        <Xplainer 
          motifs={motifs}
          visType={visType}
          allMotifs={patternDetector.allMotifs}
          sceneJSON={sceneJSON}
          pointerOffset={offsetData}
          // TODO: 24 is the height of the parameter selection
          visOffset={[sceneJSON.items[0].x, visType !== 'nodelink' ? sceneJSON.items[0].y + 24 : sceneJSON.items[0].y]}
          showAll={props.showAll}
        /> : null}
    </>
  )
}
export default VisContent