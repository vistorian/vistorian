import {Network, NetworkLink, NetworkNode} from "./netpan";
import Graph, {MultiGraph, UndirectedGraph} from "graphology";
import {findCliques} from "./cliques";
import {findConnectors} from "./findConnectors";
import {findFans} from "./fan";
import {findBridges, findHubs, findIsolatedNodes} from "./hubs";
import {BiClique, Bipartite, Clique, Cluster, NetworkPattern, NodePattern, ParallelLinks} from "./motif";
import {findParallelLinks, findSelfLinks, findStrongLinks, findWeakLinks} from "./linksPatterns";
import {isBiClique, isBipartite} from "./bipartite";
import {findBursts, findRepeatedLinks, findRepeatedLinksAndBF} from "./dynamicMotifs";
import cloneDeep from 'lodash/cloneDeep'
import {findClusters, isCluster} from "./clusters";
import { AllMotifs } from "../../../../typings";
// import { groupBy } from "lodash-es";
// import _ from "lodash-es";
import * as _ from "lodash";
import {findBicliques} from "./bicliques";


export type NodeId = string;
export type LinkTuple = [NodeId, NodeId];
export type LinkId = string;


export class PatternDetectors {
    network: Network;
    // graphologyNet: Graph = new Graph();
    graph: MultiGraph = new MultiGraph();
    undirectedGraph: UndirectedGraph = new UndirectedGraph();
    isDynamic: boolean;
    isMatrix: boolean;
    // nodes: NetworkNode[];
    // links: NetworkLink[];

    cliques: Clique[] = [];
    allMotifs: AllMotifs;


    constructor(network: Network, visType: string) {
        this.network = network;
        this.isDynamic = visType === 'timearcs';
        this.isMatrix = visType === 'matrix';
        this.netPanGraphToGraphology();
        this.allMotifs = this.getAll()
    }

    netPanGraphToGraphology() {
        // TODO: not optimal to have 2 different graph representations
        this.network.nodes.forEach(node => {
            this.graph.addNode(node.id);
            this.undirectedGraph.addNode(node.id);
        })
        this.network.links.forEach(link => {
            // this.graph.addEdge(link.source.id, link.target.id);
            this.graph.addEdgeWithKey(link.id, link.source.id, link.target.id, link);

            if (!this.undirectedGraph.hasUndirectedEdge(link.source.id, link.target.id)) {
                this.undirectedGraph.addEdge(link.source.id, link.target.id);
            }

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

        this.cliques = [];

        let motifFound: NetworkPattern[] = [];

        motifLoop:
        for (let motif of this.findMotif()) {
            if (motif.links.length == 0 && !(motif instanceof NodePattern)) {
                motif.extendLinks(this.graph);
            }

            // TODO
            // motif.findIfDynamic(this.graph);

            if (motif.isContainedBy(nodesIds, linksIds)) {
                if (motif.type() == Clique.name) {
                    this.cliques.push(motif)
                } else if (motif.type() == Cluster.name) {
                    for (let clique of this.cliques) {
                        if (motif.isContainedBy(clique.nodes)) {
                            continue motifLoop;
                        }
                    }
                }

                // TODO: Copy because generator delete nodes in memory (from networkx algorithms only I think)
                motifFound.push(motif.copy())
                // motifFound.push(motif)
            }
        }

        if (isBipartite(nodesIds, this.graph)) motifFound.push(new Bipartite(nodesIds))
        // if (isBiClique(nodesIds, this.graph)) motifFound.push(new BiClique(nodesIds))
        // if (isCluster(nodesIds, linksIds, this.graph)) motifFound.push(new Cluster(nodesIds))

        // let cluster = isCluster(nodesIds, linksIds, this.graph);
        // if (cluster) motifFound.push(cluster);

        this.sortPatterns(motifFound);
        return motifFound;
    }

    sortPatterns(patterns: NetworkPattern[]) {
        patterns.sort((a, b) => {
            if (a.type() == b.type()) {
                return b.size() - a.size();
            }
        })
    }

    *findMotif(): Generator<NetworkPattern> {
        yield* findHubs(this.graph);
        yield* findBridges(this.graph);
        // yield* findIsolatedNodes(this.graph);

        yield* findCliques(this.graph);
        yield* findClusters(this.graph);
        // yield* findConnectors(this.graph);
        yield* findFans(this.graph);
        // yield* findBicliques(this.graph);

        yield* findSelfLinks(this.graph);
        yield* findParallelLinks(this.graph, this.isMatrix);
        yield* findWeakLinks(this.graph);
        yield* findStrongLinks(this.graph);

        if (this.isDynamic) {
            // yield* findBursts(this.graph);
            // yield* findRepeatedLinks(this.graph);
            yield* findRepeatedLinksAndBF(this.graph);
        }
    }

    getAll() {
        const all = this.run(this.network.nodes, this.network.links)
        return _.groupBy(all, motif => motif.type())
    }
}