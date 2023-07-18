import {Network, NetworkLink, NetworkNode} from "./netpan";
import Graph, {MultiGraph} from "graphology";
import {findCliques} from "./cliques";
import {findConnectors} from "./findConnectors";
import {findFans} from "./fan";
import {findBridges, findHubs} from "./hubs";
import {NetworkPattern} from "./motif";

export type NodeId = string;
export type LinkTuple = [NodeId, NodeId];


export class PatternDetectors {
    network: Network;
    // graphologyNet: Graph = new Graph();
    graph: Graph = new MultiGraph();
    // nodes: NetworkNode[];
    // links: NetworkLink[];

    nodes: NodeId[];
    links: LinkTuple[];


    constructor(network: Network) {
        this.network = network;
        this.netPanGraphToGraphology();
    }

    netPanGraphToGraphology() {
        this.network.nodes.forEach(node => {
            this.graph.addNode(node.id);
        })
        this.network.links.forEach(link => {
            this.graph.addEdge(link.source.id, link.target.id);
        })
    }

    run(nodes: NodeId[], links: LinkTuple[]): NetworkPattern[] {
        this.nodes = nodes;
        this.links = links;

        // this.cliques = Array.from(findCliques(this.graph));
        // this.connectors = Array.from(findConnectors(this.graph));
        // this.fans = Array.from(findFans(this.graph));
        // this.allMotifs = [...this.cliques, ...this.connectors, ...this.fans];
        let motifFound: NetworkPattern[] = [];
        for (let motif of this.findMotif()) {
            if (motif.isContainedBy(this.nodes)) {
                // console.log(motif.nodes,  motif.constructor.name);
                motifFound.push(motif.copy())
            }
        }
        return motifFound;
    }

    *findMotif(): Generator<NetworkPattern> {
        yield* findHubs(this.graph);
        yield* findBridges(this.graph);

        yield* findCliques(this.graph);
        yield* findConnectors(this.graph);
        yield* findFans(this.graph);
    }
}