import {Network, NetworkLink, NetworkNode} from "./netpan";
import Graph, {MultiGraph} from "graphology";
import {findCliques} from "./cliques";
import {findConnectors} from "./findConnectors";
import {findFans} from "./fan";
import {findBridges, findHubs, findIsolatedNodes} from "./hubs";
import {BiClique, Bipartite, Cluster, NetworkPattern, ParallelLinks} from "./motif";
import {findParallelLinks, findSelfLinks, findStrongLinks, findWeakLinks} from "./linksPatterns";
import {isBiClique, isBipartite} from "./bipartite";
import {findBursts, findRepeatedLinks} from "./dynamicMotifs";
import cloneDeep from 'lodash/cloneDeep'
import {isCluster} from "./clusters";

export type NodeId = string;
export type LinkTuple = [NodeId, NodeId];
export type LinkId = string;


export class PatternDetectors {
    network: Network;
    // graphologyNet: Graph = new Graph();
    graph: Graph = new MultiGraph();
    isDynamic: boolean;
    // nodes: NetworkNode[];
    // links: NetworkLink[];

    // nodes: NodeId[];
    // links: LinkTuple[];


    constructor(network: Network, isDynamic: boolean) {
        this.network = network;
        this.isDynamic = isDynamic;
        this.netPanGraphToGraphology();
    }

    netPanGraphToGraphology() {
        this.network.nodes.forEach(node => {
            this.graph.addNode(node.id);
        })
        this.network.links.forEach(link => {
            // this.graph.addEdge(link.source.id, link.target.id);
            this.graph.addEdgeWithKey(link.id, link.source.id, link.target.id, link);

            // console.log(typeof link.id)
            // console.log(this.graph.edges(link.source.id, link.target.id))
            
            const copyLink = cloneDeep(link)
            // @ts-ignore
            delete copyLink.source
            // @ts-ignore
            delete copyLink.target;
            this.graph.replaceEdgeAttributes(copyLink.id, copyLink);
        })
    }

    // run(nodes: NodeId[], links: LinkId[]): NetworkPattern[] {
    run(nodes: NetworkNode[], links: NetworkLink[]): NetworkPattern[] {
        let nodesIds: NodeId[] = nodes.map(n => `${n.id}`);
        // Convert to string as link ids in NetPan are numbers but get converted as string in graphology
        let linksIds = links.map(n => `${n.id}`);

        let motifFound: NetworkPattern[] = [];
        for (let motif of this.findMotif()) {
            // if (motif.isContainedBy(this.nodes, this.links)) {
            if (motif.isContainedBy(nodesIds, linksIds)) {
                // console.log(motif.nodes,  motif.constructor.name);
                motifFound.push(motif.copy())
            }
        }

        if (isBipartite(nodesIds, this.graph)) motifFound.push(new Bipartite(nodesIds))
        if (isBiClique(nodesIds, this.graph)) motifFound.push(new BiClique(nodesIds))
        // if (isCluster(nodesIds, linksIds, this.graph)) motifFound.push(new Cluster(nodesIds))

        let cluster = isCluster(nodesIds, linksIds, this.graph);
        if (cluster) motifFound.push(cluster);
        // if (isCluster(nodesIds, linksIds, this.graph)) motifFound.push(new Cluster(nodesIds))

        return motifFound;
    }

    *findMotif(): Generator<NetworkPattern> {
        yield* findHubs(this.graph);
        yield* findBridges(this.graph);
        yield* findIsolatedNodes(this.graph);

        yield* findCliques(this.graph);
        yield* findConnectors(this.graph);
        yield* findFans(this.graph);

        yield* findSelfLinks(this.graph);
        yield* findParallelLinks(this.graph);
        yield* findWeakLinks(this.graph);
        yield* findStrongLinks(this.graph);

        if (this.isDynamic) {
            yield* findBursts(this.graph);
            yield* findRepeatedLinks(this.graph);
        }
    }
}