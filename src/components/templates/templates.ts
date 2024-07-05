import { Template } from '../../../typings'

const templates: Template[] = [
  {
    key: "nodelink",
    label: "Node-Link Diagram",
    image: "nodelink.png",
    template: "nodelink.json",
    description: "Common Force-directed layout.",
    manual: "https://vistorian.github.io/visualizations.html#node-link",
    error: ''
  },
  {
    key: "nodelink_circular",
    label: "Circular Node-link",
    image: "nodelink_circular.png",
    template: "nodelink_circular.json",
    description: "Nodes ordered along a circular layout.",
    manual: "https://vistorian.github.io/visualizations.html#node-link",
    error: ''
  },
  { 
    key: "matrix", 
    label: "Adjacency Matrix", 
    image: "matrix.png", 
    template: "matrix.json",
    description: "Table layout showing links as cells and nodes as rows and columns.",
    manual: "https://vistorian.github.io/visualizations.html#adjacency-matrix",
    error: ''
  },
  { 
    key: "arcMatrix", 
    label: "Adjacency Matrix with Arcs", 
    image: "arcMatrix.png", 
    template: "arcMatrix.json",
    description: "Table layout showing links as cells and nodes as rows and columns. Links are also shown as arcs.",
    manual: "https://vistorian.github.io/visualizations.html#adjacency-matrix",
    error: ''
  },
  { 
    key: "timearcs", 
    label: "Time-arcs", 
    image: "timearcs.png", 
    template: "timearcs.json",
    description: "Shows links as vertical arcs over time.",
    manual: "https://vistorian.github.io/visualizations.html#time-arcs",
    error: 'The network lacks temporal data.'
  },
  {
    key: "arcDiagram",
    label: "Arc Diagram",
    image: "arcDiagram.png",
    template: "arcDiagram.json",
    description: "Linear order of nodes with arcs depicting links.",
    manual: "https://vistorian.github.io",
    error: ''
  },
  {
    key: "adjacencyNodeList",
    label: "Adjacent-Nodes List",
    image: "adjacencyNodeList.png",
    template: "adjacencyNodeList.json",
    description: "Table view of nodes and their direct (adjacent) neighbors.",
    manual: "https://vistorian.github.io",
    error: ''
  },
  {
    key: "adjacencyLinkList",
    label: "Incident-Links List",
    image: "adjacencyLinkList.png",
    template: "adjacencyLinkList.json",
    description: "Table view of nodes and their links.",
    manual: "https://vistorian.github.io",
    error: ''
  },
  {
    key: "scatterplot",
    label: "Scatterplot",
    image: "scatterplot.png",
    template: "scatterplot.json",
    description: "Scatterplot layout displaying nodes on a x/y plane encoding numerical attributes.",
    manual: "https://vistorian.github.io/visualizations.html#adjacency-matrix",
    error: ''
  },
  // {
  //   key: "jigsaw",
  //   label: "Jigsaw Diagram",
  //   image: "jigsaw.png",
  //   template: "jigsaw.json",
  //   description: "Showing different types of nodes as different lines of nodes with links connecting them.",
  //   manual: "https://vistorian.github.io"
  // },
  // {
  //   key: "waffleNode",
  //   label: "Node Waffle-Chart",
  //   image: "waffleNode.png",
  //   template: "waffleNode.json",
  //   description: "Highly compact visualization of all nodes shown in an ordered grid. Links can be shown overlaid.",
  //   manual: "https://vistorian.github.io"
  // },
  // {
  //   key: "waffleLink",
  //   label: "Link Waffle-Chart",
  //   image: "waffleLink.png",
  //   template: "waffleLink.json",
  //   description: "Highly compact visualization of all links shown in an ordered grid.",
  //   manual: "https://vistorian.github.io"
  // },
  {
    key: "map",
    label: "Node-Link Map",
    image: "map.png",
    description: "A node-link diagram where nodes have corresponding geographic positions.",
    // template: "map.json",
    template: "mapSimple.json",
    manual: "https://vistorian.github.io/visualizations.html#map",
    error: 'The network lacks geographic data.'
  },
]

export default templates