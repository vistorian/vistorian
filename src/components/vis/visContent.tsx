import { Spin } from "antd"
import { useCallback, useEffect, useState } from "react"
import { AllMotifs, NetworkConfig } from "../../../typings"
import templates from "../templates/templates"
import { genSpecFromLinkTable } from "../templates/genSpec"
import useMotifDetect, { getBounds, getMotifBound } from '../xplainer/useMotifDetect'
import PatternSelection from "../xplainer/patternSelection"
// import { XYCoord, useDrop } from "react-dnd"
import { PatternDetectors } from "../xplainer/motifs/patternDetectors"
import Overlay from "../xplainer/overlay"
import { NetworkPattern } from "../xplainer/motifs/motif"
import PatternCard from "../xplainer/patternCard"
import { flatMap, groupBy, uniq } from "lodash-es"
import { Mode } from "../../../typings/status.enum"
// import * as d3 from 'd3'

interface IVisContentProps {
  type: string // "explore" || "xplainer"
  viewerId: number
  viewer: any
  setViewer: (v:any) => void
  width: string
  visType: string
  network: string
  options: any
  setAllMotifs: (m: AllMotifs) => void
  selectedTypes: string[]
  onPropogate: (id: number, newVal: any) => void
}

function VisContent(props: IVisContentProps) {
  const { viewerId, viewer, setViewer, width, visType, network, options, setAllMotifs } = props
  const [loading, setLoading] = useState<boolean>(true)
  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig

  const containerId = `visSvg${viewerId}`

  // pattern-xplainer variables
  const [patternDetector, setPatternDetector] = useState<any>({})
  // pattern selection type: rect | lasso
  const [selectType, setSelectType] = useState<string>('rect')
  let motifs = useMotifDetect(patternDetector)

  const onChange = (newVal) => {
    props.onPropogate(viewerId, newVal)
  }

  type ParamChangeCallbacks = { [paramName: string]: (newVal: string | number) => void } // refer to netpan
  const getParamCallbacks = () => {
    let cb: ParamChangeCallbacks = {}
    switch (props.type) {
      case Mode.Explorer:
        cb = {
          node_selection: onChange
        }
        break
      case Mode.Explainer:
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
    let templatePath = props.type === Mode.Explorer ? `./templates/${template.template}` : `./templates/xplainer/${template.template}`
    let spec: any = genSpecFromLinkTable(networkCfg, visType as string)
    // console.log('spec:', spec)

    // @ts-ignore
    let tmpViewer = await NetPanoramaTemplateViewer.render(templatePath, {
      dataDefinition: JSON.stringify(spec.data),
      networksDefinition: JSON.stringify(spec.network),
      selectType: `"${selectType}"`, // used for pattern xplainer
      ...options
    }, containerId, {
      renderer: renderer,
      paramCallbacks: getParamCallbacks()
    })
    // @ts-ignore
    console.log('VIEW STATE:', viewerId, tmpViewer.state)
    // console.log(JSON.stringify(tmpViewer.spec))
    setViewer(tmpViewer)
    if (props.type === Mode.Explainer) {
      let tmpPatternDetector = new PatternDetectors(tmpViewer.state.network, visType)
      setPatternDetector(tmpPatternDetector)
      setAllMotifs(patternDetector.allMotifs)
    }
    
    const container = document.getElementById(containerId)
    if (container && container.getElementsByTagName("svg").length > 0) {
      // @ts-ignore
      container.getElementsByTagName("svg")[0].style["max-width"] = "100%";
      // @ts-ignore
      container.getElementsByTagName("svg")[0].style["max-height"] = "100%";
      // d3.select(`#${containerId}`).selectAll('text').attr('pointer-events', 'none')
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

  // Xplainer related state
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
    if (Object.keys(viewer).length > 0) {
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
        <div id={containerId} style={{ width: width }} />
        {props.type === Mode.Explainer ? <PatternSelection type={selectType} setType={setSelectType} /> : null}
      </Spin>
      :
      <div
        style={{ position: 'relative', display: 'flex', width: '100%' }}
      >
        <div id={containerId}
          style={{ width: width }}  // for exploration mode
          // style={{ overflow: 'scroll', position: "relative" }} // for xplainer mode
        >
          {/* ======= pattern Explainer ======= */}
          {/* show motif overlays above vis */}
          {(props.type === Mode.Explainer && Object.keys(patternDetector).length > 0) ? 
            <Overlay
              motifs={motifs}
              open={open}
              sceneJSON={viewer.sceneJSON}
              // TODO: 24 is the height of the parameter selection
              visOffset={[viewer.sceneJSON.items[0].x, visType !== 'nodelink' ? viewer.sceneJSON.items[0].y + 24 : viewer.sceneJSON.items[0].y]}
              hoverRelatedMotif={hoverRelatedMotif}
              clickRelatedMotif={clickRelatedMotif}
              selectedMotifNo={selectedMotifNo}
            /> : null}
        </div>

        {/* ======= pattern Explainer ======= */}
        {(props.type === Mode.Explainer && Object.keys(patternDetector).length > 0) ?
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
        {props.type === Mode.Explainer ? <PatternSelection type={selectType} setType={setSelectType} /> : null}
        
      </div>
  )
}
export default VisContent