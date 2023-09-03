import { groupBy } from "lodash-es"
import { NetworkPattern } from "./motifs/motif"
import { getBounds, getMotifBound } from "./useMotifDetect"

interface IOverlayProps {
  motifs: any,
  open: boolean
  sceneJSON: any
  visOffset: [number, number],
  hoverRelatedMotif: NetworkPattern
  clickRelatedMotif: NetworkPattern
  selectedMotifNo: [number, number]
}

// components for displaying all overlays
function Overlay(props: IOverlayProps) {
  const { motifs, open, sceneJSON, visOffset, hoverRelatedMotif, clickRelatedMotif, selectedMotifNo } = props

  // calc motif bounds
  const getRelatedMotifBound = (motif: NetworkPattern) => {
    // console.log('getRelatedMotifBound:', motif)
    const relatedBound = getBounds(motif.nodes, motif.links, sceneJSON)
    const relatedMotifBound = getMotifBound(motif, relatedBound.bounds, relatedBound.boundsId)
    return relatedMotifBound
  }

  // render component
  const getRelatedMotifDiv = (motif: NetworkPattern) => {
    const relatedMotifBound = getRelatedMotifBound(motif)
    return (
      relatedMotifBound ? <OverlayItem 
        bounds={relatedMotifBound}
        status={2}
        visOffset={visOffset}
      /> : null
    )
  }
  
  // show all motif bounds in user selection area / overview mode
  const getUserMotifsDiv = (motifs: NetworkPattern[]) => {
    const groupByType = groupBy(motifs, (motif) => motif.type())
    return motifs.map((motif: NetworkPattern, index: number) => {
      const bound = getRelatedMotifBound(motif)
      let status: number = 0
      if (selectedMotifNo[0] === -1) {
        status = 1 // overview mode
      }
      else {
        const selectedMotif = groupByType[Object.keys(groupByType)[selectedMotifNo[0]]][selectedMotifNo[1]]
        status = JSON.stringify(selectedMotif) === JSON.stringify(motif) ? 2: 0
      }
      if (!bound) return
      // @ts-ignore
      return <OverlayItem
        key={index}
        bounds={bound}
        status={status}
        visOffset={visOffset}
      />
    })
  }

  return (
    // <div 
    //   style={{
    //     position: "absolute", 
    //     left: visOffset[0],
    //     top: visOffset[1],
    //   }}
    // >
    open ? <>
      {/* show selected related motif bound */}
      {clickRelatedMotif && Object.keys(clickRelatedMotif).length > 0 ? 
        getRelatedMotifDiv(clickRelatedMotif) : 
        getUserMotifsDiv(motifs.motifs)
      }
      {/* show hovered related motif bound */}
      {hoverRelatedMotif && Object.keys(hoverRelatedMotif).length > 0 ? getRelatedMotifDiv(hoverRelatedMotif) : null}
    </> : null
    // </div>
  )
}



// single overlay div ui
interface ItemProps {
  bounds: any,
  // 0-not disply; 1-overview all motifs in the user selection area; 2-selected motif
  status: number,
  visOffset: [number, number]
}

function OverlayItem(props: ItemProps) {
  const { bounds, status, visOffset } = props
  // console.log('Overlay Item:', bounds)
  return (
    <div
      style={{
        width: bounds.x2 - bounds.x1,
        height: bounds.y2 - bounds.y1,
        border: status === 0 ? '0px' : (status === 1 ? '0.5px solid #E17918' : '2px solid #E17918'),
        backgroundColor: status === 1 ? 'rgba(225, 121, 24, 0.1)' : 'rgba(225, 121, 24, 0)' ,
        // backgroundColor: status === 0 ? 'rgba(225, 121, 24, 0)' : (status === 1 ? 'rgba(225, 121, 24, 0.1)' : 'rgba(225, 121, 24, 0.2)'),
        zIndex: 3,
        position: "absolute", 
        left: bounds.x1 + visOffset[0],
        top: bounds.y1 + visOffset[1],
      }} />
  )
}

export default Overlay