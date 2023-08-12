// import {Network, NetworkNode} from "./netpan";
import Graph from "graphology";
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
    constructor(nodes: NodeId[]) {
        super(nodes);
    }
}

export class Hub extends NodePattern {
    constructor(nodes: NodeId[]) {
        super(nodes);
    }
}

export class Bridge extends NodePattern {
    constructor(nodes: NodeId[]) {
        super(nodes);
    }
}

export class LinkPattern extends NetworkPattern {
    constructor(links: LinkId[]) {
        super(null, links);
    }
}

export class ParallelLinks extends LinkPattern {
    constructor(links: LinkId[]) {
        super(links);
    }
}

export class StrongLink extends LinkPattern {
    constructor(links: LinkId[]) {
        super(links);
    }
}

export class WeakLink extends LinkPattern {
    constructor(links: LinkId[]) {
        super(links);
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