import { Template } from '../../../typings'

const templates: Template[] = [
  {
    key: "nodelink",
    label: "Node-link diagram",
    image: "nodelink.png",
    template: "nodelink.json"
  },
  {
    key: "nodelink_circular",
    label: "Node-link diagram with circular layout",
    image: "nodelink_circular.png",
    template: "nodelink_circular.json"
  },
  { 
    key: "matrix", 
    label: "Adjacency matrix", 
    image: "matrix.png", 
    template: "matrix.json" 
  },
  { 
    key: "timearcs", 
    label: "Time arcs", 
    image: "timearcs.png", 
    template: "timearcs.json" 
  },
  {
    key: "adjacencyList",
    label: "Adjacency list",
    image: "adjacencyList.png",
    template: "adjacencyList.json"
  },
  // {
  //   key: "arcDiagram",
  //   label: "Arc diagram",
  //   image: "arcDiagram.png",
  //   template: "arcDiagram.json"
  // },
  {
    key: "map",
    label: "Map",
    image: "map.png",
    template: "map.json"
  },
]

export default templates