import { Spin } from "antd"
import { useCallback, useEffect, useState } from "react"
import { AllMotifs, NetworkConfig, VisContentOptions } from "../../../typings"
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


interface IVisContentProps {
  type: string // "explore" || "xplainer"
  viewerId: number
  width: string
  visType: string
  network: string
  options: VisContentOptions
  setAllMotifs: (m: AllMotifs) => void
  selectedTypes: string[]
}

function VisContent(props: IVisContentProps) {
  const { viewerId, width, visType, network, options, setAllMotifs } = props
  const [loading, setLoading] = useState<boolean>(true)
  const [viewer, setViewer] = useState<any>({})
  const [patternDetector, setPatternDetector] = useState<any>({})
  // pattern selection type: rect | lasso
  const [selectType, setSelectType] = useState<string>('rect')

  const containerId = `visSvg${viewerId}`
  // const containerIdCopy = `visSvg${viewerId}Copy`
  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig
  // console.log(window.localStorage.getItem("UPLOADED_FILE_survey1.csv"))

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

  // const [viewerCopy, setViewerCopy] = useState<any>({})
  const update = async () => {
    // let renderer = visType === 'matrix' ? 'canvas' : 'svg'
    let renderer = 'svg'
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
    // let viewer1 = await NetPanoramaTemplateViewer.render(templatePath, {
    //   dataDefinition: JSON.stringify(spec.data),
    //   networksDefinition: JSON.stringify(spec.network),
    //   selectType: `"${selectType}"`,
    //   ...options
    // }, containerIdCopy, {
    //   renderer: renderer,
    //   paramCallbacks: getParamCallbacks()
    // })
    // setViewerCopy(viewer1)


    // @ts-ignore
    // console.log('VIEW STATE:', tmpViewer.state, tmpViewer.sceneJSON)
    let tmpPatternDetector = new PatternDetectors(tmpViewer.state.network, visType)
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


    // const containerCopy = document.getElementById(containerIdCopy)
    // if (containerCopy && containerCopy.getElementsByTagName("svg").length > 0) {
    //   // @ts-ignore
    //   containerCopy.getElementsByTagName("svg")[0].style["max-width"] = "100%";
    //   // @ts-ignore
    //   containerCopy.getElementsByTagName("svg")[0].style["max-height"] = "100%";
    // }

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
      // a related motif
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


  // const getRelatedMotifBound = (motif: NetworkPattern) => {
  //   // console.log('getRelatedMotifBound:', motif)
  //   const relatedBound = getBounds(motif.nodes, motif.links, viewerCopy.sceneJSON)
  //   const relatedMotifBound = getMotifBound(motif, relatedBound.bounds, relatedBound.boundsId)
  //   return relatedMotifBound
  // }


  // const getSnapshot = (motif: NetworkPattern) => {
  //   const ele = document.querySelector("#visSvg0Copy svg")
  //   if (ele) {
  //     const eleClone = ele.cloneNode(true) as SVGElement
  //     // TODO: 24 is the height of the parameter selection
  //     // const visOffset = [viewerCopy.sceneJSON.items[0].x, visType !== 'nodelink' ? viewerCopy.sceneJSON.items[0].y + 24 : viewerCopy.sceneJSON.items[0].y]
  //     const visOffset = [viewerCopy.sceneJSON.items[0].x, visType !== 'nodelink' ? viewerCopy.sceneJSON.items[0].y : viewerCopy.sceneJSON.items[0].y]
  //     const bounds = getRelatedMotifBound(motif)
  //     if (bounds) {
  //       eleClone.setAttribute("width", `${bounds.x2 - bounds.x1}`)
  //       eleClone.setAttribute("height", `${bounds.y2 - bounds.y1}`)
  //       eleClone.setAttribute("viewBox", `${bounds.x1 + visOffset[0]} ${bounds.y1 + visOffset[1]} ${bounds.x2 - bounds.x1} ${bounds.y2 - bounds.y1}`)
  //       // document.querySelector(`#${listId} svg`)?.remove()
  //       // document.querySelector(`#${listId}`)?.appendChild(eleClone)
  //     }
  //     // return <></>
  //     return eleClone
  //   }
  //   return
  // }

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
    // if (viewerCopy && motifs && selectedMotifNo[0]!== -1 && Object.keys(viewerCopy).length > 0) {
    //   let tmp: any = {}
    //   patternDetector.allMotifs[thisMotif.type()].map((other, idx) => {
    //     // if (JSON.stringify(other) !== JSON.stringify(thisMotif)) {
    //       // let nodeIds: string[] | number[] = other.nodes,
    //       //   linkIds: string[] | number[] = other.links
    //       // const networkName = "network";
    //       // let links: any = [], nodes: any = []
    //       // // @ts-ignore
    //       // links = viewerCopy.state[networkName].links.filter((l: any) => linkIds.includes(`${l.id}`));
    //       // // for link patterns which only have links, find their nodes
    //       // if (nodeIds.length === 0) {
    //       //   links.map((l: any) => {
    //       //     // @ts-ignore
    //       //     nodeIds.push(l.source.id, l.target.id)
    //       //   })
    //       //   // @ts-ignore
    //       //   nodeIds = uniq(nodeIds)
    //       // }
    //       // // @ts-ignore
    //       // nodes = viewerCopy.state[networkName].nodes.filter((n: any) => nodeIds.includes(`${n.id}`));
    //       // // for matrix, find hubs & bridge nodes
    //       // if (visType === 'matrix' && linkIds.length === 0) {
    //       //   links = viewerCopy.state[networkName].links.filter((l: any) => {
    //       //     // @ts-ignore
    //       //     if (nodeIds.includes(`${l.source.id}`) || nodeIds.includes(`${l.target.id}`)) {
    //       //       return true
    //       //     }
    //       //     return false
    //       //   })
    //       // }
    //       // // console.log('nodes:', nodes, 'links:', links)
    //       // viewerCopy.setParam('selected_marks', { nodes, links })
    //       const tt = {[idx]: getSnapshot(other)}
    //       tmp = {...tmp, ...tt}
    //     // }
    //   })
    //   // console.log(tmp)
    //   setSnapshots(tmp)
    // }
  }, [selectedMotifNo, clickRelatedMotif])

  return (
    loading ?
      <Spin tip="Loading" size="small">
        <div id={containerId} style={{ width: width }} />
        <PatternSelection type={selectType} setType={setSelectType} />
      </Spin>
      :
      <div // ref={drop}  
        style={{ position: 'relative', display: 'flex', width: '100%' }}
      >
        <div id={containerId}
          // style={{ width: width }}  // for exploration mode
          style={{ overflow: 'scroll', position: "relative" }}
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
        {(props.type === 'xplainer' && Object.keys(patternDetector).length > 0) ?
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
        {props.type === 'xplainer' ? <PatternSelection type={selectType} setType={setSelectType} /> : null}
        {/* capture the content */}
        {/* <div id={containerIdCopy}
          style={{ overflow: 'scroll', position: "relative", display: 'none'}}
        ></div> */}
      </div>
  )
}
export default VisContent