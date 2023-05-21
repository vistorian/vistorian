import { Template } from '../../../typings'

const templates: Template[] = [
  {
    key: "nodelink",
    label: "Node-link diagram",
    image: "nodelink.png",
    template: "nodelink.json"
  },
  { 
    key: "matrix", 
    label: "Adjacency Matrix", 
    image: "matrix.png", 
    template: "matrix.json" 
  },
  { 
    key: "timearcs", 
    label: "Time arcs", 
    image: "timearcs.png", 
    template: "timeline.json" 
  },
  { 
    key: "map", 
    label: "Map", 
    image: "map.png", 
    template: "map.json"
  },
]

export default templates