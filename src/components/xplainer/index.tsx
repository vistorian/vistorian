import { Spin } from "antd"
import { useEffect, useState } from "react"
import { AllMotifs, NetworkConfig } from "../../../typings"
import templates from "../templates/templates"
import { genSpecFromLinkTable } from "../templates/genSpec"
import useMotifDetect from './useMotifDetect'
import PatternSelection from "./patternSelection"
import { PatternDetectors } from "./motifs/patternDetectors"
import Overlay from "./overlay"
import { NetworkPattern } from "./motifs/motif"
import PatternCard from "./patternCard"
import { flatMap, groupBy, uniq } from "lodash-es"

interface IVisContentProps {
  visType: string
  network: string
  options: any
  setAllMotifs: (m: AllMotifs) => void
  selectedTypes: string[]
}

function Explainer(props: IVisContentProps) {
  const { visType, network, options, setAllMotifs } = props
  const [loading, setLoading] = useState<boolean>(true)
  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig

  const containerId = `visSvg0`
  const [viewer, setViewer] = useState<any>({})
  const [patternDetector, setPatternDetector] = useState<any>({})
  // pattern selection type: rect | lasso
  const [selectType, setSelectType] = useState<string>('rect')
  let motifs = useMotifDetect(patternDetector)

  type ParamChangeCallbacks = { [paramName: string]: (newVal: string | number) => void } // refer to netpan
  const getParamCallbacks: ParamChangeCallbacks = { pattern_selection: motifs.detectMotifs }
  
  const update = async () => {
    let renderer = visType === 'matrix' ? 'canvas' : 'svg'
    // let renderer = 'svg'
    let template = templates.filter(t => t.key === visType)[0]
    let templatePath = `./templates/xplainer/${template.template}`
    let spec: any = genSpecFromLinkTable(networkCfg, visType as string)
    // console.log('spec:', spec)

    let width = document.getElementById(containerId)?.getBoundingClientRect().width as number
    let height = document.getElementById(containerId)?.getBoundingClientRect().height as number
    if (visType === 'nodelink_circular') {
      width = width < height ? width : height
      height = width
    }

    // @ts-ignore
    let tmpViewer = await NetPanoramaTemplateViewer.render(templatePath, {
      dataDefinition: JSON.stringify(spec.data),
      networksDefinition: JSON.stringify(spec.network),
      selectType: `"${selectType}"`, // used for pattern xplainer
      width: width,
      height: height,
      ...options
    }, containerId, {
      renderer: renderer,
      paramCallbacks: getParamCallbacks
    })
    // // @ts-ignore
    console.log('VIEW STATE:', viewer.state)
    setViewer(tmpViewer)
    // console.log(JSON.stringify(tmpViewer.spec))
    let tmpPatternDetector = new PatternDetectors(tmpViewer.state.network, visType, false)
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

  // Explainer related state
  const [hoverRelatedMotif, setHoverRelatedMotif] = useState<NetworkPattern>({} as NetworkPattern)
  const [clickRelatedMotif, setClickRelatedMotif] = useState<NetworkPattern>({} as NetworkPattern)
  // related to the pattern card menu. get the pattern
  const [selectedMotifNo, setSelectedMotifNo] = useState<[number, number]>([-1, 0])
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    setHoverRelatedMotif({} as NetworkPattern)
    setClickRelatedMotif({} as NetworkPattern)
    if (motifs.motifs.length > 0) {
      setOpen(true)
    }
  }, [motifs.motifs])

  // show all motifs bounds above vis
  useEffect(() => {
    if (props.selectedTypes.length > 0 && patternDetector && Object.keys(patternDetector).length > 0) {
      motifs.setMotifs(flatMap(patternDetector.allMotifs).filter((motif: any) => props.selectedTypes.includes(motif.type())))
    }
    else {
      setOpen(false)
    }
  }, [props.selectedTypes])


  // highlight selected nodes & links in the motif
  useEffect(() => {
    if (viewer && Object.keys(viewer).length > 0) {
      let nodeIds: string[] | number[] = [],
        linkIds: string[] | number[] = []
      // jump to the related motif
      if (Object.keys(clickRelatedMotif).length > 0) {
        nodeIds = clickRelatedMotif.nodes
        linkIds = clickRelatedMotif.links
      }
      // a motif from user selection
      else if (selectedMotifNo[0] !== -1) {
        const groupByType = groupBy(motifs.motifs, (motif) => motif.type())
        const thisMotif = groupByType[Object.keys(groupByType)[selectedMotifNo[0]]][selectedMotifNo[1]]
        nodeIds = thisMotif.nodes
        linkIds = thisMotif.links
      }
      // console.log('nodeIds', nodeIds, 'linkIds:', linkIds)

      const networkName = "network";
      let links: any = [], nodes: any = []
      // @ts-ignore
      links = viewer.state[networkName].links.filter((l: any) => linkIds.includes(`${l.id}`));
      // for link patterns which only have links, find their nodes
      if (nodeIds.length === 0) {
        links.map((l: any) => {
          // @ts-ignore
          nodeIds.push(l.source.id, l.target.id)
        })
        // @ts-ignore
        nodeIds = uniq(nodeIds)
      }
      // @ts-ignore
      nodes = viewer.state[networkName].nodes.filter((n: any) => nodeIds.includes(`${n.id}`));
      // for matrix, find hubs & bridge nodes
      if (visType === 'matrix' && linkIds.length === 0) {
        links = viewer.state[networkName].links.filter((l: any) => {
          // @ts-ignore
          if (nodeIds.includes(`${l.source.id}`) || nodeIds.includes(`${l.target.id}`)) {
            return true
          }
          return false
        })
      }
      // console.log('nodes:', nodes, 'links:', links, viewer.state[networkName])
      viewer.setParam('selected_marks', { nodes, links })
    }
  }, [selectedMotifNo, clickRelatedMotif])


  // record motif bounds
  const [snapshots, setSnapshots] = useState<any>({})
  useEffect(() => {
    let thisMotif
    // a related motif
    if (Object.keys(clickRelatedMotif).length > 0) {
      thisMotif = clickRelatedMotif
    }
    // a motif from user selection
    else if (selectedMotifNo[0] !== -1) {
      let groupByType = groupBy(motifs.motifs, (motif) => motif.type())
      thisMotif = groupByType[Object.keys(groupByType)[selectedMotifNo[0]]][selectedMotifNo[1]]
    }
  }, [selectedMotifNo, clickRelatedMotif])


  // rendering
  return (
    loading ?
      <Spin tip="Loading" size="small">
        <div id={containerId} style={{ width: '100%' }} />
        <PatternSelection type={selectType} setType={setSelectType} />
      </Spin>
      :
      <div style={{ position: 'relative', width: '100%' }}>
        <div id={containerId}  style={{ width: '100%' }} />
        {/* show motif overlays above vis */}
        {Object.keys(patternDetector).length > 0 ?
          <Overlay
            motifs={motifs}
            open={open}
            sceneJSON={viewer.sceneJSON}
            // TODO: 24 for parameter height
            visOffset={[viewer.sceneJSON.items[0].x, visType !== 'nodelink' ? viewer.sceneJSON.items[0].y + 24 : viewer.sceneJSON.items[0].y]}
            hoverRelatedMotif={hoverRelatedMotif}
            clickRelatedMotif={clickRelatedMotif}
            selectedMotifNo={selectedMotifNo}
          /> : null}
        {Object.keys(patternDetector).length > 0 ?
          <>
            {motifs.contextHolder}
            <PatternCard
              visType={visType}
              open={open}
              setOpen={setOpen}
              motifs={(Object.keys(clickRelatedMotif).length > 0) ? [clickRelatedMotif] : motifs.motifs}
              allMotifs={patternDetector.allMotifs}
              networkData={viewer.state.network}
              setHoverRelatedMotif={setHoverRelatedMotif}
              setClickRelatedMotif={setClickRelatedMotif}
              selectedMotifNo={selectedMotifNo}
              setSelectedMotifNo={setSelectedMotifNo}
              snapshots={snapshots}
            />
          </> : null}
        {/* rect selection or lasso */}
        <PatternSelection type={selectType} setType={setSelectType} />        
      </div>
  )
}
export default Explainer