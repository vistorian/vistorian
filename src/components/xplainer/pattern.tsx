import { createUseStyles } from "react-jss"
import { NetworkPattern } from "./motifs/motif"
import { patternList } from "./patternList"
import { Tag, message } from "antd"
import { AllMotifs } from "../../../typings"
import { find } from "lodash-es"
import { timeFormat, timeParse } from "d3-time-format"

const useStyles = createUseStyles({
  hl: {
    position: 'relative',
    fontWeight: 600,
    whiteSpace: "pre",
    wordBreak: 'break-word',
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
  category: {
    position: 'relative',
    fontWeight: 600,
    textDecoration: 'underline',
    // '&:after': {
    //   content: '""',
    //   backgroundColor: '#FFE0B2',
    //   height: '110%',
    //   position: 'absolute',
    //   bottom: '-5%',
    //   right: '-2%',
    //   width: '104%',
    //   borderRadius: 4,
    //   zIndex: -1,
    // }
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
    zIndex: 0,
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
  networkData: any
  setHoverRelatedMotif: (d: NetworkPattern) => void
  setClickRelatedMotif: (d: NetworkPattern) => void
}

function Pattern (props: IPatternProps) {
  const { motif, visType, allMotifs, networkData, setHoverRelatedMotif, setClickRelatedMotif } = props
  const classes = useStyles()

  const motifType = motif ? motif.type() : ''
  let pattern, dataExp, visualExp, visualVariables
  // console.log('networkData', networkData)

  const genExp = () => {
    let dataExp, visualExp, link, node
    switch (motifType) {
      case 'Clique':
        dataExp = <span>A <b>Clique</b> is a <span className={classes.category}>subgraph pattern</span>, where a group of nodes are connected to every other node of the clique.</span>
        if (visType === 'timearcs') {
          visualExp = <span>The selection has <span className={classes.tag}>full arcs</span> among <span className={classes.hl}>{motif.nodes.length}</span> nodes. That is, the link density is <span className={classes.hl}>{`100%`}</span>. The size of the clique only relates to the number of nodes. The arc length depends on the positions of the respective nodes.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>The selection has a <span className={classes.tag}>complete block</span> with <span className={classes.hl}>{motif.nodes.length}</span> nodes without missing cells inside. The size of the clique only relates to the number of nodes (rows / columns). Sometimes, the block may split, but can appear by reordering.</span>
        }
        else
          visualExp = <span></span>
        break
      case 'Cluster':
        dataExp = <span>A <b>Cluster</b> is a <span className={classes.category}>subgraph pattern</span>, which refers to a group of nodes that have a high number of connections among them, higher than that of the rest of the graph.</span>
        if (visType === 'timearcs') {
          visualExp = <span>The selection is a <span className={classes.tag}>cluster</span> of <span className={classes.hl}>{motif.nodes.length}</span> nodes. These nodes are not fully connected, otherwise they form a clique. The cluster detection uses the louvain algorighm. The size of the cluster only relates to the number of nodes. The arc length depends on the positions of the respective nodes. </span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>The selection has a <span className={classes.tag}>fragmented block</span> with <span className={classes.hl}>{motif.nodes.length}</span> nodes. It contains empty cells, otherwise they form a clique. The size of the cluster only relates to the number of nodes (rows / columns). The cluster detection uses the louvain algorighm.</span>
        }
        else
          visualExp = <span> node-link </span>
        break
      case 'ClusterSubset':
        dataExp = <span>A <b>Cluster Subset</b> is a <span className={classes.category}>subgraph pattern</span>, which indicates your selection is part of a large cluster. </span>
        if (visType === 'timearcs') {
          visualExp = <span>The selection is <span className={classes.tag}>part of a cluster</span>. There are <span className={classes.hl}>{motif.nodes.length}</span> nodes in your selection. These nodes are not fully connected, otherwise they form a clique. The cluster detection uses the louvain algorighm. The size of the cluster only relates to the number of nodes. The arc length depends on the positions of the respective nodes. </span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>The selection is <span className={classes.tag}>part of a fragmented block</span> as a large block. There are <span className={classes.hl}>{motif.nodes.length}</span> nodes. It contains empty cells, otherwise they form a clique. The size of the cluster only relates to the number of nodes (rows / columns). The cluster detection uses the louvain algorighm.</span>
        }
        else
          visualExp = <span>node-link </span>
        break
      case 'Bridge':
        // TODO:
        dataExp = <span>A <b>Bridge</b> is a <span className={classes.category}>node pattern</span>, which acts as a connection between different areas and groups in the graph. If removed, they can often create disconnected components in the graph.</span>
        node = find(networkData.nodes, (n) => n.id == motif.nodes[0])
        if (visType === 'timearcs') {
          visualExp = <span>The selection is <span className={classes.hl}>node {motif.nodes[0]}</span> which has opposite arcs over time. If removed, its original neighbors would be disconnected to the whole graph. </span>
        }
        else if (visType === 'matrix') {
          visualExp = <span> The selection is a <span className={classes.tag}>row/column</span> <span className={classes.hl}>node {motif.nodes[0]}</span>. If removed, its orginal neigbors would not form blocks (clusters). </span>
        }
        else
          visualExp = <></>
        break
      case 'Hub':
        dataExp = <span>A <b>Highly Connected Node</b> is a <span className={classes.category}>node pattern</span>, which has a lot of neighbors in contrast of the rest of the graph.</span>
        node = find(networkData.nodes, (n) => n.id == motif.nodes[0])
        // console.log('Hub:', node)
        // TODO: calc connections & time 
        if (visType === 'timearcs') {
          visualExp = <span>The selection is part of a <span className={classes.tag}>dotted row</span> (<span className={classes.hl}>node {motif.nodes[0]}</span>). It has <span className={classes.hl}>xx</span> connections at <span className={classes.hl}>xx</span> different points in time in total, and is ranked top <span className={classes.hl}>xx</span> in the network. The time point <span className={classes.hl}>xx</span> has the most connections of <span className={classes.hl}>xx</span>. </span>
        }
        else if (visType === 'matrix') {
          visualExp = <span> The selection is part of a <span className={classes.tag}>dense row / column</span> (<span className={classes.hl}>node {motif.nodes[0]}</span>). It has <span className={classes.hl}>xx</span> cells colored in total, i.e., <span className={classes.hl}>xx</span> connections and is ranked the top <span className={classes.hl}>xx</span> in the network. </span>
        }
        else
          visualExp = <></>
        break
      // case 'IsolatedNode':
      //   visualExp = <span></span>
      //   dataExp = <span>An isolated node is a node without any connection, i.e., with a degree of 0.</span>
      //   break
      case 'ParallelLinks':
        dataExp = <span><b>Parallel links</b> are a <span className={classes.category}>link pattern</span>, which have the two same nodes.</span>
        link = find(networkData.links, (l) => l.id == motif.links[0])
        // console.log('ParallelLinks:', link)
        if (visType === 'timearcs') {
          visualExp = <span>The selection has <span className={classes.hl}>{motif.links.length}</span> <span className={classes.tag}>parallel arcs</span> between <span className={classes.hl}>node {link.source.data.name}</span> and <span className={classes.hl}>node {link.target.data.name}</span> at <span className={classes.hl}> time {timeFormat('%d/%m/%Y')(link.data._time)}</span>. That means these two nodes have <span className={classes.hl}>{motif.links.length}</span> connections at the same time. </span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>The selection is a <span className={classes.tag}>split cell</span> at the intersection of row (<span className={classes.hl}>node {link.source.id}</span>) and column (<span className={classes.hl}>node {link.target.id}</span>), which means these two nodes have <span className={classes.hl}>{motif.links.length}</span> diifferent connections.</span>
        }
        else
          visualExp = <></>
        break
      case 'StrongLink':
        dataExp = <span>A <b>Strong Link</b> is a <span className={classes.category}>link pattern</span>, whose weight is in the top percentile of the weights distribution.</span>
        link = find(networkData.links, (l) => l.id == motif.links[0])
        if (visType === 'timearcs') {
          visualExp = <span> The selection is a <span className={classes.tag}>thick arc</span> which connects the <span className={classes.hl}>node {link.source.data.name}</span> and <span className={classes.hl}>node {link.target.data.name}</span> with a link weight of <span className={classes.hl}>{link.linkWeight}</span>. The length of the arc depends on the positions of the respective nodes, and does not convey the link properties.</span>           
        }
        else if (visType === 'matrix') {
          visualExp = <span>The selection is a <span className={classes.tag}>solid cell</span> at the intersection of row (<span className={classes.hl}>node {link.source.id}</span>) and column (<span className={classes.hl}>node {link.target.id}</span>) with a link weight of <span className={classes.hl}>{link.linkWeight}</span>.</span>
        }
        else
          visualExp = <></>
        break
      case 'WeakLink':
        dataExp = <span>A <b>Weak Link</b> is a <span className={classes.category}>link pattern</span>, whose weight is in the bottom percentile of the weights distribution.</span>
        link = find(networkData.links, (l) => l.id == motif.links[0])
        if (visType === 'timearcs') {
          visualExp = <span> The selection is a <span className={classes.tag}>thin arc</span> which connects the <span className={classes.hl}>node {link.source.data.name}</span> and <span className={classes.hl}>node {link.target.data.name}</span> with a link weight of <span className={classes.hl}>{link.linkWeight}</span>. The length of the arc depends on the positions of the respective nodes, and does not convey the link properties.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>The selection is a transparent cell at the intersection of row (<span className={classes.hl}>node {link.source.id}</span>) and column (<span className={classes.hl}>node {link.target.id}</span>) with a link weight of <span className={classes.hl}>{link.linkWeight}</span>.</span>
        }
        else
          visualExp = <></>
        break
      case 'SelfLink':
        dataExp = <span>A <b>Self Link</b> is a <span className={classes.category}>link pattern</span>, which connects a node to itself.</span>
        link = find(networkData.links, (l) => l.id == motif.links[0])
        if (visType === 'timearcs') {
          visualExp = <span>The selection is a self arc that connects the <span className={classes.hl}>node {link.source.data.name}</span> to itself on <span className={classes.hl}>time {timeFormat('%d/%m/%Y')(link.data._time)}</span>.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>The selection is a filled cell on the matrix diagonal, which means a link that connects the node <span className={classes.hl}>{link.source.id}</span> to itself. </span>
        }
        else
          visualExp = <></>
        break
      case 'RepeatedLinks':
        dataExp = <span><b>Repeated Links</b> are a <span className={classes.category}>link pattern</span>, which have the same two nodes but appear in different times.</span>
        link = find(networkData.links, (l) => l.id == motif.links[0])
        if (visType === 'timearcs') {
          visualExp = <span> The selection has <span className={classes.hl}>{motif.links.length}</span> <span className={classes.tag}>repeated arcs</span> between <span className={classes.hl}>node {link.source.data.name}</span> and <span className={classes.hl}>node {link.target.data.name}</span> at <span className={classes.hl}>{motif.links.length}</span> different times.There is no specific regularity among times of connections. </span>
        }
        // TODO:
        else if (visType === 'matrix') {
          visualExp = <span>n/a</span>
        }
        else
          visualExp = <></>
        break
      case 'Fan':
        dataExp = <span>Fans are nodes that are connected to several other nodes of degree 1.</span>
        // TODO:
        if (visType === 'timearcs') {
          visualExp = <span>The selection has a node <span className={classes.hl}>xx</span> connecting to <span className={classes.hl}>{motif.nodes.length-1}</span> nodes which only connects to this node. The subgraph may look like S-arcs, C-arcs, B-arcs, etc. The size of the fan only relates to the number of the nodes, while the arc length depends on the positions of the respective nodes. </span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>tbd</span>
        }
        else
          visualExp = <></>
        break
      // case 'Connector':
      //   visualExp = <span></span>
      //   dataExp = <span></span>
      //   break
      case 'Bipartite':
        dataExp = <span>A <b>Bi-graph</b> is a <span className={classes.category}>subgraph pattern</span>, which has a group of nodes that can be divided into two sets, and in which connections can only occur between nodes of different sets. Nodes of the same set can not have any connections in bi-graphs.</span>
        // TODO:
        if (visType === 'timearcs') {
          visualExp = <span>The selection has <span className={classes.hl}>{motif.nodes.length}</span> nodes.The subgraph may look like rainbow arcs.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>tbd</span>
        }
        else
          visualExp = <></>
        break
      // case 'BiClique':
      //   visualExp = <span></span>
      //   dataExp = <span>A bi-graph refers to a group of nodes that can be divided into two sets, and in which connexions can only occur between nodes of different sets. Nodes of the same set can not have any connexions in bi-graphs.</span>
      //   break
      case 'Burst':
        dataExp = <span>A <b>Burst</b> is a <span className={classes.category}>node pattern</span>, whose connections are higher than the rest of the graph in this time span.</span>
        // TODO:
        if (visType === 'timearcs') {
          visualExp = <span>tbd</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>tbd</span>
        }
        else
          visualExp = <></>
        break
      default:
        dataExp = <span>no matching description</span>
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
            if (i > 0) {
              return (
                <div
                  key={i}
                  style={{ backgroundColor: '#535353', border: '2px solid #535353', borderRadius: 5, marginRight: 8 }}>
                  <img style={{ width: 115, height: 115 }} src={`./pattern-icons/${visType}/${motifType}-${i + 1}.svg`} />
                </div>)
            }
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
            {/* <span style={{ fontWeight: 600}}>{`In your selection, `}</span> */}
            {visualExp}
          </div>

          {/* provide visual variations */}
          {getVisualVariations()}

          {/* relate to variants when have more than one instances in this network */}
          {motifType in allMotifs && allMotifs[motifType].length > 1 ? 
          <div style={{ marginTop: 25 }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div className={classes.diamond}></div>
                <span>Similar instances:</span>
            </div>
            <ul>
                {allMotifs[motifType].slice(0, 10).map((other, index) => {
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
                        {`${motifType} #${index}`}
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