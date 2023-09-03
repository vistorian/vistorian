// import {Network, NetworkNode} from "./netpan";
import Graph from "graphology";
import subgraph from 'graphology-operators/subgraph';

import {NetworkNode} from "./netpan";
import {LinkId, LinkTuple, NodeId} from "./patternDetectors";

export class NetworkPattern {
    // nodes: NetworkNode[];
    nodes: NodeId[];
    // links: LinkTuple[];
    links: LinkId[];

    constructor(nodes: NodeId[], links: LinkId[]) {
        this.nodes = nodes ? nodes : [];
        this.links = links ? links : [];
    }

    type() {
        return this.constructor.name;
    }

    addNodes(nodes: any[]) {
        nodes.forEach(n => {
            if (!this.nodes.includes(n)) this.nodes.push(n)
        })
    }

    size(): number {
        return this.nodes.length;
    }

    isContainedBy(nodes: NodeId[], links: LinkId[]) {
        for (let node of this.nodes) {
            if (!nodes.includes(node)) {
                return false;
            }
        }

        if (links) {
            for (let link of this.links) {
                if (!links.includes(link)) {
                    return false;
                }
            }
        }

        return true;
    }

    copy(): NetworkPattern {
        this.nodes = [...this.nodes]
        // this.links = [...this.links]
        return this;
    }

    // Find the links in the pattern from the list of nodes and the network
    extendLinks(network: Graph) {
        let subg = subgraph(network, this.nodes);
        this.links = subg.edges();
        // console.log(links)
    }
}

export class NodePattern extends NetworkPattern {
    neighbors: number
    degree: number

    constructor(nodes: NodeId[], degree: number, neighbors: number) {
        super(nodes, null);  
        this.degree = degree
        this.neighbors = neighbors
    }

    size(): number {
        return this.degree
    }

    extendLinks(network: Graph) {
        //
    }
}

export class Hub extends NodePattern {
    constructor(nodes: NodeId[], degree: number, neighbors: number) {
        super(nodes, degree, neighbors);
    }
}

export class Bridge extends NodePattern {
    constructor(nodes: NodeId[], degree: number, neighbors: number) {
        super(nodes, degree, neighbors);
    }
}

export class IsolatedNode extends NodePattern {
    constructor(nodes: NodeId[], degree: number, neighbors: number) {
        super(nodes, degree, neighbors);
    }
}

export class LinkPattern extends NetworkPattern {
    weight: number
    constructor(links: LinkId[], weight: number) {
        super(null, links);
        this.weight = weight
    }

    extendLinks(network: Graph) {
        //
    }

    isContainedBy(nodes: NodeId[], links: LinkId[]) {
        for (let link of this.links) {
            if (!links.includes(link)) {
                return false;
            }
        }
        return true;
    }

    size(): number {
        if (this.constructor.name === 'StrongLink' || this.constructor.name === 'WeakLink')
            return this.weight
        else return this.links.length;
    }
}

export class SelfLink extends LinkPattern {
    constructor(links: LinkId[], weight: number) {
        super(links, weight);
    }
}

export class ParallelLinks extends LinkPattern {
    constructor(links: LinkId[], weight: number) {
        super(links, weight);
    }
}

export class StrongLink extends LinkPattern {
    constructor(links: LinkId[], weight: number) {
        super(links, weight);
    }
}

export class WeakLink extends LinkPattern {
    constructor(links: LinkId[], weight: number) {
        super(links, weight);
    }
}

// Time related patterns
export class RepeatedLinks extends LinkPattern {
    constructor(links: LinkId[]) {
        super(links);
    }
}

export class BackAndForth extends LinkPattern {
    constructor(links: LinkId[]) {
        super(links);
    }
}

export class Burst extends NetworkPattern {
    constructor(nodes: NodeId[], links: LinkId[]) {
        super(nodes, links);
    }

    isContainedBy(nodes: NodeId[], links: LinkId[]): boolean {
        return super.isContainedBy(nodes, links);
    }
}


export class Clique extends NetworkPattern {
    constructor(nodes: NodeId[]) {
        super(nodes);
    }
}


export class Fan extends NetworkPattern {
    constructor(nodes: NodeId[]) {
        super(nodes);
    }
}

export class Connector extends NetworkPattern {
    spanners: NodeId[] = [];
    anchors: NodeId[] = []

    constructor(nodes: NodeId[]) {
        super(nodes);
    }

    addSpanner(node: NodeId) {
        if (this.nodes.includes(node)) return;

        this.nodes.push(node);
        this.spanners.push(node);
    }

    addAnchor(node: NodeId) {
        if (this.nodes.includes(node)) return;

        this.nodes.push(node);
        this.anchors.push(node);
    }

    addAnchors(nodes: NodeId[]) {
        nodes.forEach(node => this.addAnchor(node));
    }
}


export class Bipartite extends NetworkPattern {
    constructor(nodes: NodeId[]) {
        super(nodes);
    }
}

export class BiClique extends NetworkPattern {
    constructor(nodes: NodeId[]) {
        super(nodes);
    }
}

export class Cluster extends NetworkPattern {
    constructor(nodes: NodeId[]) {
        super(nodes);
    }
}

export class ClusterSubset extends NetworkPattern {
    constructor(nodes: NodeId[]) {
        super(nodes);
    }
}