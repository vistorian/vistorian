import { createUseStyles } from "react-jss"
import { NetworkPattern } from "./motifs/motif"
import { patternList } from "./patternList"
import { Tag, message } from "antd"
import { AllMotifs } from "../../../typings"

const useStyles = createUseStyles({
  hl: {
    position: 'relative',
    fontWeight: 600,
    '&:after': {
      content: '""',
      backgroundColor: '#FFE0B2',
      height: '45%',
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '100%',
      zIndex: -1,
    }
  },
  icon: {
    width: 130,
    height: 130,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    '& img': {
      width: 115,
      height: 115,
    } 
  },
  tag: {
    position: 'relative',
    fontWeight: 'bold',
    color: 'white',
    '&:after': {
      content: '""',
      backgroundColor: '#EC9B50',
      height: '110%',
      position: 'absolute',
      bottom: '-5%',
      right: '-2%',
      width: '104%',
      borderRadius: 4,
      zIndex: -1,
    }
  },
  dataExp : {
    position: 'relative',
    marginTop: 8,
    paddingLeft: 18,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#F9F9F9',
    '&:before': {
      content: '""',
      backgroundColor: '#EC9B50',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '1%',
      zIndex: 2,
    }
  },
  diamond: {
    width: 8, 
    height: 8, 
    transform: 'rotate(-45deg)', 
    background: '#EC9B50', 
    marginRight: 5
  }
})

interface IPatternProps {
  motif: NetworkPattern
  visType: string
  allMotifs: AllMotifs
  setHoverRelatedMotif: (d: NetworkPattern) => void
  setClickRelatedMotif: (d: NetworkPattern) => void
}

function Pattern (props: IPatternProps) {
  const { motif, visType, allMotifs, setHoverRelatedMotif, setClickRelatedMotif } = props
  const classes = useStyles()

  const motifType = motif.type()
  let pattern, dataExp, visualExp, visualVariables

  const genExp = () => {
    let dataExp, visualExp
    switch (motifType) {
      case 'Clique':
        dataExp = <span>A <b>Clique</b> is a group of nodes where every node is connected to every other node of the clique.</span>
        if (visType === 'timearcs') {
          visualExp = <span>the clique has <span className={classes.hl}>{motif.nodes.length}</span> nodes, and the link density is <span className={classes.hl}>{`100%`}</span>. The length of the arc depends on the ordering of the nodes.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>the clique has <span className={classes.hl}>{motif.nodes.length}</span> nodes, and the density is <span className={classes.hl}>{`100%`}</span>.</span>
        }
        else
          visualExp = <></>
        break
      case 'Cluster':
        dataExp = <span>A <b>Cluster</b> refers to a group of nodes that have a high number of connexions between them, higher than in the rest of the graph.</span>
        if (visType === 'timearcs') {
          visualExp = <span>the cluster has <span className={classes.hl}>{motif.nodes.length}</span> nodes, and the link density is <span className={classes.hl}>{`100%`}</span>. The length of the arc depends on the ordering of the nodes.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>the clique has <span className={classes.hl}>{motif.nodes.length}</span> nodes, and the density is <span className={classes.hl}>{`100%`}</span>.</span>
        }
        else
          visualExp = <></>
        break
      case 'Bridge':
        dataExp = <span> <b>Bridge nodes</b> are nodes that act as a connection between different areas and groups in the graph.If removed, they can often create disconnected components.</span>
        if (visType === 'timearcs') {
          visualExp = <span>the clique has <span className={classes.hl}>{motif.nodes.length}</span> nodes, and the link density is <span className={classes.hl}>{`100%`}</span>. The length of the arc depends on the ordering of the nodes.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>the clique has <span className={classes.hl}>{motif.nodes.length}</span> nodes, and the density is <span className={classes.hl}>{`100%`}</span>.</span>
        }
        else
          visualExp = <></>
        break
      case 'Hub':
        visualExp = <span></span>
        dataExp = <span>A highly connected node is a node that has a lot of neighbors in contrast of the rest of the graph.</span>
        break
      case 'IsolatedNode':
        visualExp = <span></span>
        dataExp = <span>An isolated node is a node without any connection, i.e., with a degree of 0.</span>
        break
      case 'ParallelLinks':
        visualExp = <span></span>
        dataExp = <span>Parallel links are links that have the two same incident nodes.</span>
        break
      case 'StrongLink':
        visualExp = <span></span>
        dataExp = <span>Link with a weight in the top percentile of the weights distribution.</span>
        break
      case 'WeakLink':
        visualExp = <span></span>
        dataExp = <span>Link with a weight in the bottom percentile of the weights distribution.</span>
        break
      case 'SelfLink':
        visualExp = <span></span>
        dataExp = <span>Self links refer to links that connects a node to itself.</span>
        break
      case 'RepeatedLinks':
        visualExp = <span></span>
        dataExp = <span>Repeated Links are links between the same two nodes but appear in different times."</span>
        break
      case 'Burst':
        visualExp = <span></span>
        dataExp = <span>A <b>cluster</b> refers to a group of nodes that have a high number of connexions between them, higher than in the rest of the graph.</span>
        break
      case 'Fan':
        visualExp = <span></span>
        dataExp = <span>Fans are nodes that are connected to several other nodes of degree 1.</span>
        break
      case 'Connector':
        visualExp = <span></span>
        dataExp = <span></span>
        break
      case 'Bipartite':
        visualExp = <span></span>
        dataExp = <span></span>
        break
      case 'BiClique':
        visualExp = <span></span>
        dataExp = <span>A bi-graph refers to a group of nodes that can be divided into two sets, and in which connexions can only occur between nodes of different sets. Nodes of the same set can not have any connexions in bi-graphs.</span>
        break
      default:
        visualExp = <span>no matching description.</span>
    }
    return { dataExp, visualExp }
  }

  const getVisIcon = () => {
    if (visType === 'nodelink') {
      return null
    }
    else {
      return <img src={`./pattern-icons/${visType}/${motifType}-1.svg`}/>
    } 
  }

  const getVisualVariations = () => {
    if (visType !== 'nodelink' && pattern[visType].length > 1) {
      const varibles = pattern[visType]
      return (
      <div style={{ marginTop: 25 }}>
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <div className={classes.diamond}></div>
          <span>The selected pattern may visually vary, like: </span>
        </div>
        <div style={{ display: 'flex', marginTop: 5 }}>
          {varibles.map((v: string, i: number) => {
            if (i > 0)
            return (
              <div 
                key={i}
                style={{ backgroundColor: '#535353', border: '2px solid #535353', borderRadius: 5, marginRight: 8 }}>
                <img style={{ width: 115, height: 115 }} src={`./pattern-icons/${visType}/${motifType}-${i+1}.svg`} />
              </div>)
          })}
        </div>
      </div>)
    }
  }

  if (motif) {
    if (motifType in patternList) {
      pattern = patternList[motifType]
      const exp = genExp()
      dataExp = exp.dataExp
      visualExp = exp.visualExp
    }
    else {
      message.error('No matching pattern!!')
    }
  }

  return (
    <>
      {pattern ? 
        <div style={{ padding: 12}}>
          {/* icons */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', margin: '10px 0px', padding: '10px 0px', backgroundColor: '#F9F9F9'}}>
          {/* visual pattern icon */}
            <div className={classes.icon} style={{ backgroundColor: '#535353', border: '2px solid #535353', borderRadius: 5 }}>
              {/* <span style={{ fontSize: 20, fontWeight: 500, color: '#535353' }}>{motifType}</span> */}
              {getVisIcon()}
            </div>
          {/* data pattern icon */}
            <div className={classes.icon} style={{ border: '2px solid #535353', borderRadius: 5}}>
              {/* <span style={{fontSize: 20, fontWeight: 500}}>{motifType}</span> */}
              <img src={`./pattern-icons/nodelink/${motifType}.svg`} />
            </div>
         </div>

          <span style={{fontSize: 18}}>This is a <span className={classes.tag}>{pattern.title}</span> pattern. </span>

          {/* description */}
          <div className={classes.dataExp}>
            {dataExp}
          </div>

          {/* explain your selection */}
          <div style={{ marginTop: 25}}>
            <span style={{ fontWeight: 600}}>{`In your selection, `}</span>
            {visualExp}
          </div>

          {/* provide visual variations */}
          {getVisualVariations()}

          {/* relate to variants when have more than one instances in this network */}
          {allMotifs[motifType].length > 1 ? 
          <div style={{ marginTop: 25 }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div className={classes.diamond}></div>
                <span>Similar instances:</span>
            </div>
            <ul>
                {allMotifs[motifType].map((other, index) => {
                  if (JSON.stringify(other) !== JSON.stringify(motif))
                    return <li key={index}>
                      <span 
                        onMouseOver={() => { 
                          setHoverRelatedMotif(other)
                        }}
                        onMouseOut={() => {
                          setHoverRelatedMotif({} as NetworkPattern)
                        }}
                        onClick={() => {
                          setClickRelatedMotif(other)
                          // setHoverRelatedMotif({} as NetworkPattern)
                        }}>
                        {motifType} ({index})
                        </span>
                      </li>
                })}
                
            </ul>
          </div> : null}
        </div> : null}
    </>
  )
}

export default Pattern