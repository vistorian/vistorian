export interface PatternContent {
  title: string,
  type: string,
  variants: string[]
} 

export interface PatternList {
  [key: string]: PatternContent
}

export const patternList: PatternList = {
  "Clique": {
    title: "Clique",
    type: 'subgraph',
    variants: ["Large clique", "Small clique", "Clique with self-link", "Clique without self-link"]
  },
  "Cluster": {
    title: "Cluster",
    type: 'subgraph',
    variants: []
  },
  "Bridge": {
    title: "Bridge Node",
    type: 'node',
    variants: []
  },
  "Hub": {
    title: "Highly Connected Node",
    type: 'node',
    variants: []
  },
  "IsolatedNode": {
    title: "Isolated Node",
    type: 'node',
    variants: []
  },
  "ParallelLinks": {
    title: "Parallel Links",
    type: 'link',
    variants: []
  },
  "StrongLink": {
    title: "Strong Link",
    type: 'link',
    variants: []
  },
  "WeakLink": {
    title: "Weak Link",
    type: 'link',
    variants: []
  },
  "SelfLink": {
    title: "Self Link",
    type: 'link',
    variants: []
  },
  "RepeatedLinks": {
    title: "Repeated Links",
    type: 'temporal',
    variants: []
  },
  "Fan": {
    title: "Fan",
    type: 'subgraph',
    variants: []
  },
  "Bipartite": {
    title: "Bi-graph",
    type: 'subgraph',
    variants: []
  },
  "Connector": {
    title: "Connector",
    type: 'subgraph',
    variants: []
  },
  "Burst": {
    title: "Burst",
    type: 'node',
    variants: []
  },
  "BiClique": {
    title: "BiClique",
    type: 'subgraph',
    variants: []
  }
}