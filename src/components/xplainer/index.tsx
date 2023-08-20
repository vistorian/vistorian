import { useEffect, useState } from "react"
import PatternCard from "./patternCard"
import { NetworkPattern } from "./motifs/motif"
import { getBounds, getMotifBound } from "./useMotifDetect"
import { AllMotifs } from "../../../typings"

interface IXplainerPros {
  motifs: any
  visType: string
  pointerOffset: [number, number],
  visOffset: [number, number]
  sceneJSON: any,
  allMotifs: AllMotifs
  showAll: boolean
}

function Xplainer(props: IXplainerPros) {
  const { motifs, visType, pointerOffset, visOffset, sceneJSON } = props
  const [currentMotif, setCurrentMotif] = useState('-1')
  // display related motif
  const [hoverRelatedMotif, setHoverRelatedMotif] = useState<NetworkPattern>()
  const [clickRelatedMotif, setClickRelatedMotif] = useState<NetworkPattern>()
  // const [openRelatedMotif, setOpenRelatedMotif] = useState<boolean>(true)
  const [open, setOpen] = useState<boolean>(false)

  const getRelatedMotifBound = (motif: NetworkPattern) => {
    const relatedBound = getBounds(motif.nodes, motif.links, sceneJSON)
    const relatedMotifBound = getMotifBound(motif, relatedBound.bounds, relatedBound.boundsId)
    return relatedMotifBound 
  }

  const getRelatedMotifDiv = (motif: NetworkPattern) => {
    const relatedMotifBound = getRelatedMotifBound(motif)
    return (
      relatedMotifBound ? <div
        style={{
          width: relatedMotifBound.x2 - relatedMotifBound.x1,
          height: relatedMotifBound.y2 - relatedMotifBound.y1,
          border: '2px solid #E17918',
          backgroundColor: 'rgba(225, 121, 24, 0.5)',
          position: "absolute",
          zIndex: 2,
          transform: `translate(${relatedMotifBound.x1 + visOffset[0]}px, ${relatedMotifBound.y1 + visOffset[1]}px)`
        }} /> : null
    )
  }

  const getRelatedPatternCard = (motif: NetworkPattern) => {
    const relatedMotifBound = getRelatedMotifBound(motif)
    return (
      (clickRelatedMotif && relatedMotifBound ) ?
      <PatternCard
        visType={visType}
        open={open}
        setOpen={setOpen}
        motifs={[clickRelatedMotif]}
        offset={[relatedMotifBound.x2 + visOffset[0] + 5, relatedMotifBound.y1 + visOffset[1]]}
        allMotifs={props.allMotifs}
        setHoverRelatedMotif={setHoverRelatedMotif}
        setClickRelatedMotif={setClickRelatedMotif}
      />: null)
  }

  useEffect(() => {
    setHoverRelatedMotif({} as NetworkPattern)
    setClickRelatedMotif({} as NetworkPattern)
    setCurrentMotif('-1')
    if (motifs.motifs.length > 0) {
      setOpen(true)
    }
  }, [motifs.motifs])

  useEffect(() => {
    if (clickRelatedMotif && Object.keys(clickRelatedMotif).length > 0) {
      setOpen(true)
    }
  }, [clickRelatedMotif])

  return (
    <>
      {motifs.contextHolder}
      {(clickRelatedMotif && Object.keys(clickRelatedMotif).length > 0) ? 
        // select a related motif (show single motif)
        getRelatedPatternCard(clickRelatedMotif) : 
        // show motifs based on user selecteion
        <PatternCard
          visType={visType}
          open={open}
          setOpen={setOpen}
          motifs={motifs.motifs}
          offset={pointerOffset}
          allMotifs={props.allMotifs}
          setHoverRelatedMotif={setHoverRelatedMotif}
          setClickRelatedMotif={setClickRelatedMotif}
          currentMotif={currentMotif}
          setCurrentMotif={setCurrentMotif}
        />
      }
      {/* show selected bounds above vis */}
      { (!clickRelatedMotif || Object.keys(clickRelatedMotif).length === 0) && open ? <>
        {motifs.motifsBound.map((bounds: any, index: number) => {
          if (!bounds) return
          return <div 
          key={index}
          style={{
            width: bounds.x2-bounds.x1,
            height: bounds.y2-bounds.y1,
            border: currentMotif === '-1' ? '0.5px solid #E17918' : (index === Number(currentMotif) ? '2px solid #E17918' : '0px'),
            backgroundColor: currentMotif === '-1' ? 'rgba(225, 121, 24, 0.08)'  : (index === Number(currentMotif) ? 'rgba(225, 121, 24, 0.5)' : 'rgba(225, 121, 24, 0)'),
            position: "absolute",
            zIndex: 2,
            transform: `translate(${bounds.x1 + visOffset[0]}px, ${bounds.y1 + visOffset[1]}px)`
          }} />
        })}
        </> : null}

        {/* show hovered related motif bound */}
        {hoverRelatedMotif && Object.keys(hoverRelatedMotif).length > 0 ? getRelatedMotifDiv(hoverRelatedMotif): null}

        {/* show selected related motif bound */}
        {clickRelatedMotif && Object.keys(clickRelatedMotif).length > 0 ? getRelatedMotifDiv(clickRelatedMotif) : null}
    </>
  )
}

export default Xplainer