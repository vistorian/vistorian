// Interfaces coming from netpanorama

export interface NetworkNode {
  id: number; // or string?
  [id: string]: any;
}

export interface NetworkLink {
  id?: string;
  source: NetworkNode;
  target: NetworkNode;
  data?: any;
  directed?: boolean; // a network may contain a mixture of directed and undirected edges: ensure handled correctly during addingReverse edges and when calculating metrics
}

export interface Network {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export interface Range {
  min: number;
  max: number;
}


// export {NetworkNode, NetworkLink, Network, Range}