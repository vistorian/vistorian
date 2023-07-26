export interface PatternContent {
  title: string,
  explanation: string,
  variants: string[]
} 

export interface PatternList {
  [key: string]: PatternContent
}

export const patternList: PatternList = {
  "Clique": {
    title: "Clique",
    explanation: "A clique is a set of nodes where every node is connected to each other.",
    variants: ["Large clique", "Small clique", "Clique with self-link", "Clique without self-link"]
  },
  "Cluster": {
    title: "Cluster",
    explanation: "A cluster is a set of nodes with many mutual connections. A cluster becomes a clique when all nodes in the cluster are connected to all other nodes in that cluster.",
    variants: []
  },
  "Bridge": {
    title: "Bridge Node",
    explanation: "A bridge node is a node that connects two clusters.",
    variants: []
  },
  "Hub": {
    title: "Highly Connected Node",
    explanation: "A highly connected node is a node with many connections. The number of connections is also called the degree of the node or the node degree.",
    variants: []
  },
  "Fan": {
    title: "Fan",
    explanation: "A fan node is a node that with many connections yet few of those have subsequent connections. Hence, the fan node is the only connection between its neighbours and the rest of the graph.",
    variants: []
  }
}