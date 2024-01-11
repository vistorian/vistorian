import { Template } from '../../../typings'

const templates: Template[] = [
  {
    key: "nodelink",
    label: "Node-link diagram",
    image: "nodelink.png",
    template: "nodelink.json",
    manual: "https://vistorian.github.io/visualizations.html#node-link",
  },
  {
    key: "nodelink_circular",
    label: "Node-link diagram with circular layout",
    image: "nodelink_circular.png",
    template: "nodelink_circular.json",
    manual: "https://vistorian.github.io/visualizations.html#node-link"
  },
  { 
    key: "matrix", 
    label: "Adjacency matrix", 
    image: "matrix.png", 
    template: "matrix.json",
    manual: "https://vistorian.github.io/visualizations.html#adjacency-matrix"
  },
  { 
    key: "timearcs", 
    label: "Time arcs", 
    image: "timearcs.png", 
    template: "timearcs.json",
    manual: "https://vistorian.github.io/visualizations.html#time-arcs"
  },
  // {
  //   key: "arcDiagram",
  //   label: "Arc diagram",
  //   image: "arcDiagram.png",
  //   template: "arcDiagram.json"
  // },
  // {
  //   key: "adjacencyNodeList",
  //   label: "Adjacency node list",
  //   image: "adjacencyNodeList.png",
  //   template: "adjacencyNodeList.json"
  // },
  // {
  //   key: "adjacencyLinkList",
  //   label: "Adjacency link list",
  //   image: "adjacencyLinkList.png",
  //   template: "adjacencyLinkList.json"
  // },
  // {
  //   key: "jigsaw",
  //   label: "Jigsaw",
  //   image: "jigsaw.png",
  //   template: "jigsaw.json"
  // },
  // {
  //   key: "waffleNode",
  //   label: "Waffle node chart",
  //   image: "waffleNode.png",
  //   template: "waffleNode.json"
  // },
  // {
  //   key: "waffleLink",
  //   label: "Waffle link chart",
  //   image: "waffleLink.png",
  //   template: "waffleLink.json"
  // },
  // {
  //   key: "map",
  //   label: "Map",
  //   image: "map.png",
  //   template: "map.json",
  //   manual: "https://vistorian.github.io/visualizations.html#map"
  // },
]

export default templates