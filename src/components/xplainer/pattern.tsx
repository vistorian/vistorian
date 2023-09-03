import { createUseStyles } from "react-jss"
import { NetworkPattern } from "./motifs/motif"
import { patternList } from "./patternList"
import { Collapse, CollapseProps, Tag, message } from "antd"
import { AllMotifs } from "../../../typings"
import { chunk, find, findIndex } from "lodash-es"
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
      // height: 115,
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
  motif: any
  visType: string
  allMotifs: AllMotifs
  networkData: any
  setHoverRelatedMotif: (d: NetworkPattern) => void
  setClickRelatedMotif: (d: NetworkPattern) => void
  setSelectedMotifNo: (d: [number, number]) => void
}

function Pattern (props: IPatternProps) {
  const { motif, visType, allMotifs, networkData, setHoverRelatedMotif, setClickRelatedMotif, setSelectedMotifNo } = props
  const classes = useStyles()

  const motifType = motif ? motif.type() : ''
  // const motifType: string = 'RepeatedLinks'
  let pattern, dataExp, visualExp, description
  // console.log('Pattern', motif) 

  const toOrdinal = (n: number) => {
    return `${n}` + (['st', 'nd', 'rd'][n < 20 ? (n-1) : (n % 10 -1)] || 'th')
  }

  const genExp = () => {
    let dataExp, description, link, node, density, rank
    switch (motifType) {
      case 'StrongLink':
        dataExp = <span>A <b>Strong Link</b> is a <span className={classes.category}>link pattern</span>, whose weight is in the top percentile of the weights distribution.</span>
        link = find(networkData.links, (l) => l.id == motif.links[0])
        rank = findIndex(allMotifs['StrongLink'], (e) => e.links[0] === `${link.id}` ) + 1
        if (visType === 'timearcs') {
          visualExp = <span> This pattern is an arc between two circles that is thicker than most other arcs.The thicker the arc, the stronger (more weight) is the connection. The vertical length of an arc has no per - se meaning; it merely reflects the distance of nodes on the vertical ordering.</span> 

          description = <span>Your selected link connects node <span className={classes.hl}>{link.source.data.name}</span> and node <span className={classes.hl}>{link.target.data.name}</span> at time <span className={classes.hl}>{timeFormat('%d/%m/%Y')(link.data._time)}</span>, and is ranked the <span className={classes.hl}>{toOrdinal(rank)}</span> strongest in the network with a link weight of <span className={classes.hl}>{link.linkWeight}</span>.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span> This pattern shows a solid cell in the matrix that is more dark or more opaque than most other cells in the matrix. The darker the cell, the stronger (more weight) the connection.</span> 

          description = <span>Your selected link connects node <span className={classes.hl}>{link.source.id}</span> and node <span className={classes.hl}>{link.target.id}</span>, and is ranked the <span className={classes.hl}>{toOrdinal(rank)}</span> strongest in the network with a link weight of <span className={classes.hl}>{link.linkWeight}</span>.</span>
        }
        else {
          visualExp = <span>This pattern is a line between two circles that is thicker than most other lines. The ticker the line, the stronger (or more weight) the connection has. Length of the line does not have any meeing per se. Longer lines usually mean that the respective nodes are connected to very different parts of the network, i.e., have different neighborhoods. </span>

          description = <span>Your selected link connects node <span className={classes.hl}>{link.source.id}</span> and node <span className={classes.hl}>{link.target.id}</span>, and is ranked the <span className={classes.hl}>{toOrdinal(rank)}</span> strongest in the network with a link weight of <span className={classes.hl}>{link.linkWeight}</span>.</span>
        }          
        break
      case 'WeakLink':
        dataExp = <span>A <b>Weak Link</b> is a <span className={classes.category}>link pattern</span>, whose weight is in the bottom percentile of the weights distribution.</span>
        link = find(networkData.links, (l) => l.id == motif.links[0])
        rank = findIndex(allMotifs['WeakLink'], (e) => e.links[0] === `${link.id}`) + 1
        if (visType === 'timearcs') {
          visualExp = <span> This pattern is an arc between two circles that is thinner than most other arcs.The thinner the cell, the weaker (less weight) the connection. The vertical length of an arc has no per-se meaning; it merely reflects the distance of nodes on the vertical ordering.</span>

          description = <span>Your selected link connects node <span className={classes.hl}>{link.source.data.name}</span> and node <span className={classes.hl}>{link.target.data.name}</span> at time <span className={classes.hl}>{timeFormat('%d/%m/%Y')(link.data._time)}</span>, and is ranked the <span className={classes.hl}>{toOrdinal(rank)}</span> weakest in the network with a link weight of <span className={classes.hl}>{link.linkWeight}</span>.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>This pattern shows a transparent cell in the matrix that is less dark or more opaque than most other cells in the matrix. The lighter the cell, the weaker (less weight) the connection.</span>

          description = <span>Your selected link connects node <span className={classes.hl}>{link.source.id}</span> and node <span className={classes.hl}>{link.target.id}</span>, and is ranked the <span className={classes.hl}>{toOrdinal(rank)}</span> weakest in the network with a link weight of <span className={classes.hl}>{link.linkWeight}</span>.</span>
        }
        else {
          visualExp = <span>This pattern is a line between two circles that is thinner than most other lines. The ticker the line, the weaker (or less weight) the connection has. Longer lines usually mean that the respective nodes are connected to very different parts of the network, i.e., have different neighborhoods.</span>

          description = <span>Your selected link connects node <span className={classes.hl}>{link.source.id}</span> and node <span className={classes.hl}>{link.target.id}</span>, and is ranked the <span className={classes.hl}>{toOrdinal(rank)}</span> weakest in the network with a link weight of <span className={classes.hl}>{link.linkWeight}</span>.</span>
        }
        break
      case 'SelfLink':
        dataExp = <span>A <b>Self Link</b> is a <span className={classes.category}>link pattern</span>, which connects a node to itself.</span>
        link = find(networkData.links, (l) => l.id == motif.links[0])
        if (visType === 'timearcs') {
          visualExp = <span>This pattern is an arc that goes back to the same node it originates. It is visible as a small circle besides a node.</span>

          description = <span>Your selected link belongs to node <span className={classes.hl}>{link.source.data.name}</span>.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>This pattern shows a single filled cell located along the diagonal of the matrix.</span>

          description = <span>Your selected link belongs to node <span className={classes.hl}>{link.source.id}</span>.</span>
        }
        else {
          visualExp = <span>This pattern is a small loop that goes back to the same node it originates.</span>

          description = <span>Your selected link belongs to node <span className={classes.hl}>{link.source.id}</span>.</span>
        }
        break
      case 'ParallelLinks':
        dataExp = <span><b>Parallel links</b> are a <span className={classes.category}>link pattern</span>, which have the two same nodes.</span>
        link = find(networkData.links, (l) => l.id == motif.links[0])
        // console.log('ParallelLinks:', link)
        if (visType === 'timearcs') {
          visualExp = <span>This pattern shows several arcs that connect the same two nodes. For better readability, arcs are slighly offset at their most extreme point. The more arcs there are, the more links connect the two nodes. The vertical length of an arc has no per-se meaning; it merely reflects the distance of nodes on the vertical ordering.</span>

          description = <span>Your selection has <span className={classes.hl}>{motif.links.length}</span> parallel links between node <span className={classes.hl}>{link.source.data.name}</span> and node <span className={classes.hl}>{link.target.data.name}</span> at the same time <span className={classes.hl}>{timeFormat('%d/%m/%Y')(link.data._time)}</span>.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span> This pattern shows a cell that is splitted into multiple cells.Each sub-cell represents one link. The more subdivisions there are, the more links connect the two nodes.</span>

          description = <span>Your selection has <span className={classes.hl}>{motif.links.length}</span> diifferent connections between node <span className={classes.hl}>{link.source.id}</span> and node <span className={classes.hl}>{link.target.id}</span>.</span>
        }
        else {
          visualExp = <span>This pattern shows several arcs connecting the same two nodes. For better readability, arcs have different heights so they appear as a bundle. The more arcs there are, the more links these two nodes share. </span>

          description = <span>Your selection has <span className={classes.hl}>{motif.links.length}</span> diifferent connections between node <span className={classes.hl}>{link.source.id}</span> and node <span className={classes.hl}>{link.target.id}</span>.</span>
        }
        break
      case 'RepeatedLinks':
        dataExp = <span><b>Repeated Links</b> are a <span className={classes.category}>link pattern</span>, which have the same two nodes but appear in different times.</span>
        link = find(networkData.links, (l) => l.id == motif.links[0])
        if (visType === 'timearcs') {
          visualExp = <span>This pattern shows several arcs that connect the same two nodes but happen at different times.The more arcs there are, the more links connect the two nodes. The regularity of horizontal distances between lines refers to the regularity of connections in time. The vertical length of an arc has no per-se meaning; it merely reflects the distance of nodes on the vertical ordering.</span>

          description = <span> Your selection has <span className={classes.hl}>{motif.links.length}</span> <span className={classes.tag}>repeated links</span> that happened <span className={classes.hl}>{motif.links.length}</span> different times between node <span className={classes.hl}>{link.source.data.name}</span> and node <span className={classes.hl}>{link.target.data.name}</span>.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>n/a</span>
          description = <span>n/a</span>
        }
        else {
          visualExp = <span>n/a</span>
          description = <span>n/a</span>
        }
        break
      case 'Hub':
        dataExp = <span>A <b>Hub</b> is a <span className={classes.category}>node pattern</span>, which has a lot of neighbors in contrast of the rest of the graph.</span>
        node = find(networkData.nodes, (n) => n.id == motif.nodes[0])
        rank = findIndex(allMotifs['Hub'], (e) => e.nodes[0] === `${node.id}`) + 1
        // console.log('Hub:', node)
        if (visType === 'timearcs') {
          visualExp = <span>This pattern shows a circle with lots of arcs. The arcs can point to the same area or be spread accross the whole height of the visualization. They can also be at the top or the bottom of the node. The more arcs there are, the more central the node is in the network.</span>

          description = <span>Your selected node <span className={classes.hl}>{node.data.name}</span> has <span className={classes.hl}>{motif.neighbors}</span> neighbors with a sum weight of <span className={classes.hl}>{motif.degree}</span> at time <span className={classes.hl}>{timeFormat('%d/%m/%Y')(node.data.date)}</span>. This makes it the <span className={classes.hl}>{toOrdinal(rank)}</span> most connected node in the network.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>This pattern shows a row (or column) in the matrix with many cells. Cells can be close together or spread across the entire length of the row (or column). The more cells there are in this row (or column), the more connection this node has. If the entire row (or column) is filled with cells. This node represented by the row (or column) is connected to all nodes in the networks. Rows and columns are symmetric, so any dense row or column will appear as a cross in the matrix.</span>

          description = <span>Your selected node <span className={classes.hl}>{node.id}</span> has <span className={classes.hl}>{motif.neighbors}</span> neighbors with a sum weight of <span className={classes.hl}>{motif.degree}</span>. This makes it the <span className={classes.hl}>{toOrdinal(rank)}</span> most connected node in the network.</span>
        }
        else {
          visualExp = <span>This pattern is show as s single circle with many lines. This pattern is usually found in dense or central areas of the node-link diagram. The more lines the circle has, the more connections it has.</span>

          description = <span>Your selected node <span className={classes.hl}>{node.id}</span> has <span className={classes.hl}>{motif.neighbors}</span> neighbors with a sum weight of <span className={classes.hl}>{motif.degree}</span>. This makes it the <span className={classes.hl}>{toOrdinal(rank)}</span> most connected node in the network.</span>
        }
        break
      case 'Bridge':
        dataExp = <span>A <b>Bridge</b> is a <span className={classes.category}>node pattern</span>, which acts as a connection between different areas and groups in the graph. If removed, they can often create disconnected components in the graph.</span>
        node = find(networkData.nodes, (n) => n.id == motif.nodes[0])
        // console.log('Bridge:', node, motif)
        if (visType === 'timearcs') {
          visualExp = <span>This pattern shows a circle with lots of arcs to two (or more) distinct sets of circles that do not have (many) arcs between them. The different areas can be on the same side of the node (top or bottom) or on different sides. They can also be close or far from the node. The more areas the node connects, the more parts of the network the node connects.</span>

          description = <span>Your selected node <span className={classes.hl}>{node.data.name}</span> connects to <span className={classes.hl}>{motif.neighbors}</span> neighbors that are in two (or more) distinct sets at time <span className={classes.hl}>{timeFormat('%d/%m/%Y')(node.data.date)}</span>.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>This pattern is shown as a dense row (or column) that is connected to at least two different blocks. Blocks can be fragmented. The more cells there are in the respective row, the more nodes the bridge node connects. The more blocks this row touches on, the more parts of the network the node connects.</span>

          description = <span>Your selected node <span className={classes.hl}>{node.id}</span> connects to <span className={classes.hl}>{motif.neighbors}</span> neighbors that are in two (or more) distinct sets.</span>
        }
        else {
          visualExp = <span>This pattern is shown as a circle with lines to circles in diffrent, usually more dense, parts of the network visualization. The number of lines can show how strong the birdge node is connecting the respecive parts of the network.</span>
          description = <span>Your selected node <span className={classes.hl}>{node.id}</span> connects to <span className={classes.hl}>{motif.neighbors}</span> neighbors that are in two (or more) distinct sets.</span>
        }
        break
      case 'Fan':
        dataExp = <span>A <b>Fan</b> is a <span className={classes.category}>subgraph pattern</span>, where a node connects to several other nodes of degree 1.</span>
        node = find(networkData.nodes, (n) => n.id == motif.nodes[0])
        if (visType === 'timearcs') {
          visualExp = <span>This pattern shows a circle with lots of arcs that connect circles without arcs between them. The circles can be at the top or the bottom of the node, and close or far from it. The more arcs there are, the larger the fan is.</span>

          description = <span>Your selection has a node <span className={classes.hl}>{node.data.name}</span> connecting to <span className={classes.hl}>{motif.nodes.length - 1}</span> other nodes which only connects to this node at time <span className={classes.hl}>{timeFormat('%d/%m/%Y')(node.data.date)}</span>.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>This pattern is shown as a set of cells in the same row (or column) with the matching column (or rows) entirely empty. Cells can appear very close to each other, i.e., a continuous block of cells. Or, cells can be spread across the entire row (or column). The more cells with otherwise empty rows (or columns), the larger this fan is. </span>

          description = <span>Your selection has a node <span className={classes.hl}>{node.data.name}</span> connecting to <span className={classes.hl}>{motif.nodes.length - 1}</span> other nodes which only connects to this node.</span>
        }
        else {
          visualExp = <span>This patterns shows a circle connected to many other individual circles that does not have any other connection. This pattern is often found at the perihpery of a node-link diagram, looking like a hand with fingers. </span>

          description = <span>Your selection has a node <span className={classes.hl}>{node.data.name}</span> connecting to <span className={classes.hl}>{motif.nodes.length - 1}</span> other nodes which only connects to this node.</span>
        }
        break
      case 'Clique':
        dataExp = <span>A <b>Clique</b> is a <span className={classes.category}>subgraph pattern</span>, where a group of nodes are connected to every other node of the clique.</span>
        if (visType === 'timearcs') {
          visualExp = <span>This pattern shows a set of circles and at least one arc between any two circles in the set. In other words, It often appears as rhytmic set of overlapping circles. </span>

          description = <span>Your selection is a clique with <span className={classes.hl}>{motif.nodes.length}</span> nodes and <span className={classes.hl}>{motif.links.length}</span> mutual links connecting each of the nodes to each other.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>This pattern is shown as a solid squared block of cells along the diagonal. In some cases, the block can be fragmented, i.e., the square is divided into full rectangles or arrays of cells.The larger the block, the more nodes are in the clique.</span>

          description = <span> Your selection is a clique with <span className={classes.hl}>{motif.nodes.length}</span> nodes and <span className={classes.hl}>{motif.links.length}</span> mutual links connecting each of the nodes to each other..</span>
        }
        else {
          visualExp = <span>This pattern shows a set of circles with lines connecting every pair of circles. It often shows as nodes being placed very close and can result in a harmonically and strongly connected area of the node-link visualization. </span>
          description = <span>Your selection is a clique with <span className={classes.hl}>{motif.nodes.length}</span> nodes and <span className={classes.hl}>{motif.links.length}</span> mutual links connecting each of the nodes to each other.</span>
        }
        break
      case 'Cluster':
        dataExp = <span>A <b>Cluster</b> is a <span className={classes.category}>subgraph pattern</span>, which refers to a group of nodes that have a high number of connections among them, higher than that of the rest of the graph.</span>
        density = motif.links.length / (motif.nodes.length * motif.nodes.length) * 100
        // console.log('Cluster:', motif)
        
        if (visType === 'timearcs') {
          visualExp = <span>This pattern shows a set of circles with many arcs between any two circles. It often appears as a dense set of overlapping circles. The cluster can also be split into separate areas that are far away, but densely connected between them. The higher the ration of arcs on the number of circles, the more links the cluster has, the denser it is.</span>
          description = <span>Your selection is a cluster of with <span className={classes.hl}>{motif.nodes.length}</span> nodes and <span className={classes.hl}>{motif.links.length}</span> links. This results in a density of <span className={classes.hl}>{density.toFixed(1)}%</span> of all possible links between these nodes. If the density was 1, the pattern would be a clique. Here, we use the Louvain clustering algorighm.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>This pattern is usually shown as a dense, square-ish, and symmetrically clumped set of cells along the matrix diagonal. The area can be split into multiple aligned densely filled sub-areas spread more widely over the matrix.The larger the area of cells is the more nodes are part of this cluster. The denser this area is, i.e., the higher the ratio of cells to rows and columns, the more links the cluster has, i.e., the denser it is. </span>

          description = <span>Your selection is a cluster of with <span className={classes.hl}>{motif.nodes.length}</span> nodes and <span className={classes.hl}>{motif.links.length}</span> links. This results in a density of <span className={classes.hl}>{density.toFixed(1)}%</span> of all possible links between these nodes. If the density was 1, the pattern would be a clique. Here, we use the Louvain clustering algorighm.</span>
        }
        else {
          visualExp = <span>This pattern shows an area of the node-link visualization with many circles and lines connecting these circles. It often appears much denser than the rest of the visualization. The more lines involved, the denser the cluster is.</span>

          description = <span>Your selection is a cluster of with <span className={classes.hl}>{motif.nodes.length}</span> nodes and <span className={classes.hl}>{motif.links.length}</span> links. This results in a density of <span className={classes.hl}>{density.toFixed(1)}%</span> of all possible links between these nodes. If the density was 1, the pattern would be a clique. Here, we use the Louvain clustering algorighm.</span>
        }
        break
      case 'ClusterSubset':
        dataExp = <span>A <b>Cluster Subset</b> is a <span className={classes.category}>subgraph pattern</span>, which indicates your selection is part of a large cluster. </span>
        density = motif.links.length / (motif.nodes.length * motif.nodes.length) * 100
        if (visType === 'timearcs') {
          visualExp = <span>This pattern shows a set of circles with many arcs between any two circles. It often appears as a dense set of overlapping circles. The cluster can also be split into separate areas that are far away, but densely connected between them. The higher the ration of arcs on the number of circles, the more links the cluster has, the denser it is.</span>
          description = <span>Your selection is a cluster of with <span className={classes.hl}>{motif.nodes.length}</span> nodes and <span className={classes.hl}>{motif.links.length}</span> links. This results in a density of <span className={classes.hl}>{density.toFixed(1)}%</span> of all possible links between these nodes. If the density was 1, the pattern would be a clique. Here, we use the Louvain clustering algorighm.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>This pattern is usually shown as a dense, square-ish, and symmetrically clumped set of cells along the matrix diagonal. The area can be split into multiple aligned densely filled sub-areas spread more widely over the matrix.The larger the area of cells is the more nodes are part of this cluster. The denser this area is, i.e., the higher the ratio of cells to rows and columns, the more links the cluster has, i.e., the denser it is. </span>

          description = <span>Your selection is a cluster of with <span className={classes.hl}>{motif.nodes.length}</span> nodes and <span className={classes.hl}>{motif.links.length}</span> links. This results in a density of <span className={classes.hl}>{density.toFixed(1)}%</span> of all possible links between these nodes. If the density was 1, the pattern would be a clique. Here, we use the Louvain clustering algorighm.</span>
        }
        else {
          visualExp = <span>This pattern shows an area of the node-link visualization with many circles and lines connecting these circles. It often appears much denser than the rest of the visualization. The more lines involved, the denser the cluster is.</span>

          description = <span>Your selection is a cluster of with <span className={classes.hl}>{motif.nodes.length}</span> nodes and <span className={classes.hl}>{motif.links.length}</span> links. This results in a density of <span className={classes.hl}>{density.toFixed(1)}%</span> of all possible links between these nodes. If the density was 1, the pattern would be a clique. Here, we use the Louvain clustering algorighm.</span>
        }
        break
      case 'Bipartite':
        dataExp = <span>A <b>Bi-graph</b> is a <span className={classes.category}>subgraph pattern</span>, which has a group of nodes that can be divided into two sets, and in which connections can only occur between nodes of different sets. Nodes of the same set can not have any connections in bi-graphs.</span>
        // TODO:
        if (visType === 'timearcs') {
          visualExp = <span>This pattern shows two sets of circles with arcs between the two sets but not within. This pattern has a high visual variation, depending on how the circles are distributed vertically. The two sets of circles can be visually splitted (one at the bottom, one at the top) or mixed. The more arcs there are, the more connections there are between the two sets of the bigraph.</span>
          description = <span>Your selected bigraph has <span className={classes.hl}>{motif.nodes.length}</span> nodes, divided into two sets of <span className={classes.hl}>xx</span> nodes and <span className={classes.hl}>xx</span> nodes, respectively.</span>
        }
        else if (visType === 'matrix') {
          visualExp = <span>This pattern shows two dense areas of blocks, both blocks being symmetrically located off the diagonal area. Blocks can be complete, but do not have to be but rather can look slightly fragmanted. The more dense these blocks are, the more connections there are between the two set of nodes in the bigraph. </span>
          description = <span>Your selected bigraph has <span className={classes.hl}>{motif.nodes.length}</span> nodes, divided into two sets of <span className={classes.hl}>xx</span> nodes and <span className={classes.hl}>xx</span> nodes, respectively.</span>
        }
        else {
          visualExp = <span>This pattern shows two sets of circles where there are lines existing only between circles of different sets. Bigraphs in node-link visualizations can be very hard to spot and take on a lot of different visual forms. </span>
          description = <span>Your selected bigraph has <span className={classes.hl}>{motif.nodes.length}</span> nodes, divided into two sets of <span className={classes.hl}>xx</span> nodes and <span className={classes.hl}>xx</span> nodes, respectively.</span>
        }
        break
      // case 'IsolatedNode':
      //   description = <span></span>
      //   dataExp = <span>An isolated node is a node without any connection, i.e., with a degree of 0.</span>
      //   break
      // case 'Connector':
      //   description = <span></span>
      //   dataExp = <span></span>
      //   break
      // case 'BiClique':
      //   description = <span></span>
      //   dataExp = <span>A bi-graph refers to a group of nodes that can be divided into two sets, and in which connexions can only occur between nodes of different sets. Nodes of the same set can not have any connexions in bi-graphs.</span>
      //   break
      case 'Burst':
        dataExp = <span>A <b>Burst</b> is a <span className={classes.category}>node pattern</span>, whose connections are higher than the rest of the graph in this time span.</span>
        // TODO:
        if (visType === 'timearcs') {
          description = <span>tbd</span>
        }
        else if (visType === 'matrix') {
          description = <span>tbd</span>
        }
        else
          description = <></>
        break
      default:
        dataExp = <span>no matching description</span>
        description = <span>no matching description.</span>
    }
    return { dataExp, visualExp, description }
  }

  const getVisIcon = () => {
    let prefix = visType === 'timearcs' ? 'timearcs_s' : visType
    let post = motifType
    if (motifType && motifType === 'RepeatedLinks') {
      prefix = 'timearcs_t'
      post = 'ParallelLinks'
    }
    return <img src={`./pattern-icons/${prefix}_${post}.png`} />
  }

  const getVisualVariations = () => {
    if (pattern[visType] > 0) {
      let prefix = visType === 'timearcs' ? 'timearcs_s' : visType
      let post = motifType
      if (motifType && motifType === 'RepeatedLinks') {
        prefix = 'timearcs_t'
        post = 'ParallelLinks'
      }
      return (
      <div style={{ marginTop: 25 }}>
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <div className={classes.diamond}></div>
          <span>The selected pattern may visually vary, like: </span>
        </div>
        <div style={{ display: 'flex', marginTop: 5 }}>
          {new Array(pattern[visType]).fill(true).map((v: string, i: number) => {
              return (
                <div
                  key={i}
                  style={{ marginRight: 5 }}>
                  <img style={{ width: 115, height: 115 }} src={`./pattern-icons/${prefix}_${post}_${i+1}.png`} />
                </div>)
          })}
        </div>
      </div>)
    }
  }
  const getList = () => {
    return <ul>
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
                setSelectedMotifNo([0, 0])
                // setHoverRelatedMotif({} as NetworkPattern)
              }}>
              {`${patternList[motifType].title} #${index}`}
            </span>
          </li>
      })}
    </ul> 
  }

  const getItems = () => {
    const chunks = chunk(allMotifs[motifType], 10)
    const items = chunks.map((chunk, index) => {
      return ({
        key: index,
        label: <span> {`${patternList[motifType].title} [${index * 10}, ${index * 10 + 9}]`}</span>,
        children: <ul>
          {chunk.map((other, idx) => {
            // if (JSON.stringify(other) !== JSON.stringify(motif))
              return <li key={idx}>
                <span
                  onMouseOver={() => {
                    setHoverRelatedMotif(other)
                  }}
                  onMouseOut={() => {
                    setHoverRelatedMotif({} as NetworkPattern)
                  }}
                  onClick={() => {
                    setClickRelatedMotif(other)
                    setSelectedMotifNo([0, 0])
                    // setHoverRelatedMotif({} as NetworkPattern)
                  }}>
                  {`${patternList[motifType].title} #${index * 10 + idx}`}
                </span>
              </li>
          })}
        </ul>
      })
    }) as CollapseProps['items']
    return items
  }

  if (motif) {
    if (motifType in patternList) {
      pattern = patternList[motifType]
      const exp = genExp()
      visualExp = exp.visualExp
      dataExp = exp.dataExp
      description = exp.description
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
            <div className={classes.icon}>
              {getVisIcon()}
            </div>
          {/* data pattern icon */}
            <div className={classes.icon}>
              <img src={`./pattern-icons/${motifType}.png`} />
            </div>
         </div>

          <span style={{fontSize: 18}}>This is a <span className={classes.tag}>{pattern.title}</span> pattern. </span>

          {/* define data pattern */}
          <div className={classes.dataExp}>
            {dataExp}
          </div>

          {/* explain why these visuals are considered as the above data patterns */}
          <div style={{ marginTop: 25}}>
            {visualExp}
          </div>

          {/* explain the selection statistics */}
          <div style={{ marginTop: 25 }}>
            {description}
          </div>

          {/* provide visual variations */}
          {getVisualVariations()}

          {/* relate to variants when have more than one instances in this network */}
          {motifType in allMotifs && allMotifs[motifType].length > 1 ? 
          <div style={{ marginTop: 25 }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div className={classes.diamond}></div>
                <span>Similar instances in your network (ranked by the size):</span>
            </div>
            {allMotifs[motifType].length < 10 ? 
              getList() :
              <Collapse
                items={getItems()}
                ghost
                defaultActiveKey={[]}
              />}

          </div> : null}
        </div> : null}
    </>
  )
}

export default Pattern