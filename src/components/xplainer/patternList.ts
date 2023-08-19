export interface PatternContent {
  title: string,
  type: string,
  timearcs: string[],
  matrix: string[]
} 

export interface PatternList {
  [key: string]: PatternContent
}

export const patternList: PatternList = {
  "Clique": {
    title: "Clique",
    type: 'subgraph',
    timearcs: ['Clique-1'],
    matrix: ['Clique-1', 'Clique-2']
  },
  "Cluster": {
    title: "Cluster",
    type: 'subgraph',
    timearcs: ['Cluster-1'],
    matrix: ['Cluster-1', 'Cluster-2', 'Cluster-3']
  },
  "Bridge": {
    title: "Bridge Node",
    type: 'node',
    timearcs: ['Bridge-1'],
    matrix: ['Bridge-1', 'Bridge-2', 'Bridge-3']
  },
  "Hub": {
    title: "Highly Connected Node",
    type: 'node',
    timearcs: ['Hub-1'],
    matrix: ['Hub-1']
  },
  "IsolatedNode": {
    title: "Isolated Node",
    type: 'node',
    timearcs: ['IsolatedNode-1'],
    matrix: ['IsolatedNode-1']
  },
  "ParallelLinks": {
    title: "Parallel Links",
    type: 'link',
    timearcs: ['ParallelLinks-1', 'ParallelLinks-2'],
    matrix: ['ParallelLinks-1']
  },
  "StrongLink": {
    title: "Strong Link",
    type: 'link',
    timearcs: ['StrongLink-1'],
    matrix: ['StrongLink-1']
  },
  "WeakLink": {
    title: "Weak Link",
    type: 'link',
    timearcs: ['WeakLink-1'],
    matrix: ['WeakLink-1']
  },
  "SelfLink": {
    title: "Self Link",
    type: 'link',
    timearcs: ['SelfLink-1'],
    matrix: ['SelfLink-1']
  },
  "RepeatedLinks": {
    title: "Repeated Links",
    type: 'temporal',
    timearcs: ['RepeatedLinks-1', 'RepeatedLinks-2', 'RepeatedLinks-3', 'RepeatedLinks-4'],
    matrix: []
  },
  "Fan": {
    title: "Fan",
    type: 'subgraph',
    timearcs: ['Fan-1', 'Fan-2', 'Fan-3'],
    matrix: ['Fan-1']
  },
  "Bipartite": {
    title: "Bi-graph",
    type: 'subgraph',
    timearcs: ['Bipartite-1'],
    matrix: ['Bipartite-1']
  },
  "Connector": {
    title: "Connector",
    type: 'subgraph',
    timearcs: ['Connector-1'],
    matrix: ['Connector-1']
  },
  "Burst": {
    title: "Burst",
    type: 'node',
    timearcs: ['Burst-1'],
    matrix: ['Burst-1']
  },
  "BiClique": {
    title: "BiClique",
    type: 'subgraph',
    timearcs: ['BiClique-1'],
    matrix: ['BiClique-1']
  }
}