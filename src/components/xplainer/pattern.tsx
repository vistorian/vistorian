import { createUseStyles } from "react-jss"
import { NetworkPattern } from "./motifs/motif"
import { patternList } from "./patternList"
import { message } from "antd"

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
  }
})

interface IPatternProps {
  motif: NetworkPattern
  visType: string
}

function Pattern (props: IPatternProps) {
  const { motif, visType } = props
  const classes = useStyles()

  let pattern, dataExp, visualExp, visualVariables

  const genExp = () => {
    let dataExp, visualExp
    switch (motif.type()) {
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
          visualExp = <span>the clique has <span className={classes.hl}>{motif.nodes.length}</span> nodes, and the link density is <span className={classes.hl}>{`100%`}</span>. The length of the arc depends on the ordering of the nodes.</span>
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
      return <img src={`./pattern-icons/${visType}/${motif.type()}-1.svg`}/>
    } 
  }

  const getVisualVariables = () => {
    if (visType !== 'nodelink' && pattern[visType].length > 1) {
      const varibles = pattern[visType]
      return (<div style={{ marginTop: 25 }}>
        <span>The selected pattern may visually vary, like: </span>
        <div style={{ display: 'flex', marginTop: 5 }}>
          {varibles.map((v: string, i: number) => {
            if (i > 0)
            return (
              <div 
                key={i}
                style={{ backgroundColor: '#535353', border: '2px solid #535353', borderRadius: 5 }}>
                <img style={{ width: 115, height: 115 }} src={`./pattern-icons/${visType}/${motif.type()}-${i+1}.svg`} />
              </div>)
          })}
        </div>
      </div>)
    }
  }

  if (motif) {
    if (motif.type() in patternList) {
      pattern = patternList[motif.type()]
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
          <span>The selected pattern is a <b>{pattern.title}</b> pattern. </span>
          {/* icons */}
         <div style={{display: 'flex', width: '100%', justifyContent: 'space-around', margin: '10px 0px'}}>
          {/* visual pattern icon */}
            <div className={classes.icon} style={{ backgroundColor: '#535353', border: '2px solid #535353', borderRadius: 5 }}>
              {/* <span style={{ fontSize: 20, fontWeight: 500, color: '#535353' }}>{motif.type()}</span> */}
              {getVisIcon()}
            </div>
          {/* data pattern icon */}
            <div className={classes.icon} style={{ border: '2px solid #535353', borderRadius: 5}}>
              {/* <span style={{fontSize: 20, fontWeight: 500}}>{motif.type()}</span> */}
              <img src={`./pattern-icons/nodelink/${motif.type()}.svg`} />
            </div>
         </div>

          {/* description */}
          <div>
            {dataExp}
          </div>

          {/* explain your selection */}
          <div style={{ marginTop: 25}}>
            <span style={{ fontWeight: 600}}>{`In your selection, `}</span>
            {visualExp}
          </div>

          {getVisualVariables()}

          {/* relate to variants */}
          <div style={{ marginTop: 25 }}>
            <span style={{ fontSize: 20, fontWeight: 600 }}>Similar instances:</span>
            <br />
          </div>
        </div> : null}
    </>
  )
}

export default Pattern