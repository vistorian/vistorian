import { NetworkPattern } from "./motifs/motif"

export interface PatternContent {
  title: string,
  type: string,
  description: string
  nodelink: number,
  timearcs: number,
  matrix: number,
} 

export interface PatternList {
  [key: string]: PatternContent
}

export const patternList: PatternList = {
  "Clique": {
    title: "Clique",
    type: 'subgraph',
    nodelink: 3,
    timearcs: 0,
    matrix: 3,
    description: 'Cliques are groups of nodes where every node is connected to every other node of the clique.',
  },
  // "ClusterSubset": {
  //   title: "Cluster Subset",
  //   type: 'subgraph',
  //   nodelink: 3,
  //   timearcs: 3,
  //   matrix: 3,
  //   description: 'It is a subset of a cluster.',
  // },
  "Cluster": {
    title: "Cluster",
    type: 'subgraph',
    nodelink: 3,
    timearcs: 3,
    matrix: 3,
    description: 'A cluster refers to a group of nodes that have a high number of connexions between them, higher than in the rest of the graph.',
  },
  "Bridge": {
    title: "Bridge Node",
    type: 'node',
    nodelink: 3,
    timearcs: 3,
    matrix: 3,
    description: 'Bridge nodes are nodes that act as a connexion between different areas and groups in the graph. If removed, they can often create disconnected components.'
  },
  "Hub": {
    title: "Hub",
    type: 'node',
    nodelink: 3,
    timearcs: 3,
    matrix: 3,
    description: 'A node that has a lot of neighbors in contrast of the rest of the graph.',
  },
  "IsolatedNode": {
    title: "Isolated Node",
    type: 'node',
    nodelink: 3,
    timearcs: 3,
    matrix: 3,
    description: 'A node without any connection, i.e., with a degree of 0.'
  },
  "ParallelLinks": {
    title: "Parallel Links",
    type: 'link',
    nodelink: 0,
    timearcs: 0,
    matrix: 0,
    description: 'Parallel links are links that have the two same incident nodes.',
  },
  "StrongLink": {
    title: "Strong Link",
    type: 'link',
    nodelink: 0,
    timearcs: 0,
    matrix: 0,
    description: 'Link with a weight in the top percentile of the weights distribution.'
  },
  "WeakLink": {
    title: "Weak Link",
    type: 'link',
    nodelink: 0,
    timearcs: 0,
    matrix: 0,
    description: 'Link with a weight in the bottom percentile of the weights distribution.'
  },
  "SelfLink": {
    title: "Self Link",
    type: 'link',
    nodelink: 0,
    timearcs: 0,
    matrix: 3,
    description: 'Self links refer to links that connects a node to itself.'
  },
  "RepeatedLinks": {
    title: "Repeated Links",
    type: 'temporal',
    nodelink: 0,
    timearcs: 3,
    matrix: 0,
    description: 'Repeated connections consists in the links appearing in different times, between the same two nodes.'
  },
  "Fan": {
    title: "Fan",
    type: 'subgraph',
    nodelink: 3,
    timearcs: 3,
    matrix: 3,
    description: 'Fans are nodes that are connected to several other nodes of degree 1.'
  },
  "Bipartite": {
    title: "Bi-graph",
    type: 'subgraph',
    nodelink: 3,
    timearcs: 3,
    matrix: 3,
    description: 'A bi-graph refers to a group of nodes that can be divided into two sets, and in which connexions can only occur between nodes of different sets. Nodes of the same set can not have any connections in bi-graphs.'
  },
  "BackAndForth": {
    title: "Back And Forth",
    type: 'link',
    nodelink: 0,
    timearcs: 3,
    matrix: 0,
    description: 'A back and forth link appears in directed networks when two nodes are connected to each other in the respective opposite direction at different time.'
  },
  // "Connector": {
  //   title: "Connector",
  //   type: 'subgraph',
  //   nodelink: 0,
  //   timearcs: 0,
  //   matrix: 0,
  //   description: ''
  // },
  // "Burst": {
  //   title: "Burst",
  //   type: 'node',
  //   nodelink: 0,
  //   timearcs: 0,
  //   matrix: 0,
  //   description: ''
  // },
  // "BiClique": {
  //   title: "BiClique",
  //   type: 'subgraph',
  //   nodelink: 0,
  //   timearcs: 0,
  //   matrix: 0,
  //   description: ''
  // }
}