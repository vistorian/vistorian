import { Spin } from "antd"
import { useCallback, useEffect, useState } from "react"
import { AllMotifs, NetworkConfig, VisContentOptions } from "../../../typings"
import templates from "../templates/templates"
import { genSpecFromLinkTable } from "../templates/genSpec"
import useMotifDetect from '../xplainer/useMotifDetect'
import PatternSelection from "../xplainer/patternSelection"
// import { XYCoord, useDrop } from "react-dnd"
import { PatternDetectors } from "../xplainer/motifs/patternDetectors"
import Overlay from "../xplainer/overlay"
import { NetworkPattern } from "../xplainer/motifs/motif"
import PatternCard from "../xplainer/patternCard"
import { groupBy } from "lodash-es"


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
  const [viewer, setViewer] = useState<any>({})
  const [patternDetector, setPatternDetector] = useState<any>({})
  // pattern selection type: rect | lasso
  const [selectType, setSelectType] = useState<string>('rect')

  const containerId = `visSvg${viewerId}`
  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig


  let motifs = useMotifDetect(patternDetector)
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
    let tmpViewer = await NetPanoramaTemplateViewer.render(templatePath, {
      dataDefinition: JSON.stringify(spec.data),
      networksDefinition: JSON.stringify(spec.network),
      selectType: `"${selectType}"`,
      ...options
    }, containerId, {
      renderer: renderer,
      paramCallbacks: getParamCallbacks()
    })
    // @ts-ignore
    console.log('VIEW STATE:', tmpViewer.state, tmpViewer.sceneJSON)
    let tmpPatternDetector = new PatternDetectors(tmpViewer.state.network)
    // console.log('patternDetector', tmpPatternDetector.allMotifs)
    // setNetworkData(viewer.state.network)
    setViewer(tmpViewer)
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

  // drag pattern card
  // const moveBox = useCallback(
  //   (id: string, left: number, top: number) => {
  //     setOffsetData([left, top])
  //   },
  //   [offsetData, setOffsetData],
  // )
  // const [, drop] = useDrop(
  //   () => ({
  //     accept: 'box',
  //     drop(item: any, monitor) {
  //       const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
  //       const left = Math.round(item.left + delta.x)
  //       const top = Math.round(item.top + delta.y)
  //       moveBox(item.id, left, top)
  //       return undefined
  //     },
  //   }),
  //   [moveBox],
  // )

  // Xplainer related state
  const [hoverRelatedMotif, setHoverRelatedMotif] = useState<NetworkPattern>({} as NetworkPattern)
  const [clickRelatedMotif, setClickRelatedMotif] = useState<NetworkPattern>({} as NetworkPattern)
  const [selectedMotifNo, setSelectedMotifNo] = useState<[number, number]>([-1, 0])
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    setHoverRelatedMotif({} as NetworkPattern)
    setClickRelatedMotif({} as NetworkPattern)
    if (motifs.motifs.length > 0) {
      setOpen(true)
    }
  }, [motifs.motifs])

  useEffect(() => {
    if (Object.keys(viewer).length > 0) {
      let nodeIds: string[] | number[] = [], 
        linkIds: string[] | number[] = []
      // select a related motif
      if (Object.keys(clickRelatedMotif).length > 0) {
        // console.log('clickRelatedMotif', clickRelatedMotif)
        nodeIds = clickRelatedMotif.nodes
        linkIds = clickRelatedMotif.links
      }
      // selecta a motif from user selection area
      else if (selectedMotifNo[0] !== -1) {
        const groupByType = groupBy(motifs.motifs, (motif) => motif.type())
        const thisMotif = groupByType[Object.keys(groupByType)[selectedMotifNo[0]]][selectedMotifNo[1]]
        // console.log('thisMotif', groupByType, thisMotif)
        nodeIds = thisMotif.nodes
        linkIds = thisMotif.links
      }

      const networkName = "network"; 
      // @ts-ignore
      const nodes = viewer.state[networkName].nodes.filter((n: any) => nodeIds.includes(n.id));
      // @ts-ignore
      const links = viewer.state[networkName].links.filter((l: any) => linkIds.includes(l.id));
      viewer.setParam('selected_graph', { nodes, links })
    }
  }, [selectedMotifNo, clickRelatedMotif])

  return (
    loading ? 
      <Spin tip="Loading" size="small">
        <div id={containerId} style={{ width: width }} />
        <PatternSelection type={selectType} setType={setSelectType} />
      </Spin> 
      : 
      <div // ref={drop}  
        style={{position: 'relative', display: 'flex', width: '100%'}}
      >
        <div id={containerId} 
        // style={{ width: width }}  // for exploration mode
        style={{ overflow: 'scroll', position: "relative"}}
        >
          {/* show motif overlays above vis */}
          <Overlay 
            motifs={motifs}
            open={open}
            sceneJSON={viewer.sceneJSON}
            // TODO: 24 is the height of the parameter selection
            visOffset={[viewer.sceneJSON.items[0].x, visType !== 'nodelink' ? viewer.sceneJSON.items[0].y + 24 : viewer.sceneJSON.items[0].y]}
            hoverRelatedMotif={hoverRelatedMotif}
            clickRelatedMotif={clickRelatedMotif}
            selectedMotifNo={selectedMotifNo}
          />
        </div>
        {/* pattern card */}
        {(props.type === 'xplainer' && Object.keys(patternDetector).length>0) ? 
          <>
            {motifs.contextHolder}
            <PatternCard
              visType={visType}
              open={open}
              setOpen={setOpen}
              motifs={(Object.keys(clickRelatedMotif).length > 0) ? [clickRelatedMotif] : motifs.motifs}
              showClickRelatedMotif={Object.keys(clickRelatedMotif).length > 0}
              allMotifs={patternDetector.allMotifs}
              setHoverRelatedMotif={setHoverRelatedMotif}
              setClickRelatedMotif={setClickRelatedMotif}
              setSelectedMotifNo={setSelectedMotifNo}
            />
          </>: null}
        {/* rect selection or lasso */}
        <PatternSelection type={selectType} setType={setSelectType} />
      </div>
  )
}
export default VisContent