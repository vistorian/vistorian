// import {Network, NetworkNode} from "./netpan";
import Graph from "graphology";
import {NetworkNode} from "./netpan";
import {NodeId} from "./patternDetectors";

export class NetworkPattern {
    network: Graph;
    // nodes: NetworkNode[];
    nodes: NodeId[];

    constructor(nodes: NodeId[], network: Graph) {
        this.network = network;
        this.nodes = nodes ? nodes : [];
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

    isContainedBy(nodes: NodeId[]) {
        for (let node of this.nodes) {
            if (!nodes.includes(node)) {
                return false;
            }
        }
        return true;
    }

    copy(): NetworkPattern {
        this.nodes = [...this.nodes]
        return this;
    }
}

export class NodePattern extends NetworkPattern {
    constructor(nodes: NodeId[], network: Graph) {
        super(nodes, network);
    }
}

export class Hub extends NodePattern {
    constructor(nodes: NodeId[], network: Graph) {
        super(nodes, network);
    }
}

export class Bridge extends NodePattern {
    constructor(nodes: NodeId[], network: Graph) {
        super(nodes, network);
    }
}


export class Clique extends NetworkPattern {
    constructor(nodes: NodeId[], network: Graph) {
        super(nodes, network);
    }
}

export class Fan extends NetworkPattern {
    constructor(nodes: NodeId[], network: Graph) {
        super(nodes, network);
    }
}

export class Connector extends NetworkPattern {
    spanners: NodeId[] = [];
    anchors: NodeId[] = []

    constructor(nodes: NodeId[], network: Graph) {
        super(nodes, network);
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