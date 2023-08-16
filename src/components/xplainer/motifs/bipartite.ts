import {NodeId} from "./patternDetectors";
import Graph, {NodeKey} from "graphology";

import subgraph from 'graphology-operators/subgraph';


type NodePartition = 'A' | 'B';

// No exhaustive search
export function isBipartite(nodes: NodeId[], network: Graph): [NodePartition[], NodePartition[]] | false {
    let length = nodes.length;
    if (length < 4) return false;

    const sub = subgraph(network, nodes);
    let nEdges = sub.edges().length;
    if (nEdges == 0) return false;


    const nodePartition: Map<NodeKey, NodePartition> = new Map();
    const visitedNodes: Set<NodeKey> = new Set();
    const partitionA: NodePartition[] = [];
    const partitionB: NodePartition[] = [];

    function dfs(node: NodeKey, partition: NodePartition): boolean {
        visitedNodes.add(node);
        nodePartition.set(node, partition);

        if (partition === 'A') {
            partitionA.push(node);
        } else {
            partitionB.push(node);
        }

        // const neighbors = network.neighbors(node);
        const neighbors = sub.neighbors(node);

        for (const neighbor of neighbors) {
            if (!visitedNodes.has(neighbor)) {
                if (!dfs(neighbor, partition === 'A' ? 'B' : 'A')) {
                    return false;
                }
            } else if (nodePartition.get(neighbor) === partition) {
                return false;
            }
        }

        return true;
    }

    // for (const node of network.nodes()) {
    for (const node of sub.nodes()) {
        if (!visitedNodes.has(node)) {
            if (!dfs(node, 'A')) {
                return false;
            }
        }
    }

    return [partitionA, partitionB];
}


// No exhaustive search
export function isBiClique(nodes: NodeId[], network: Graph) {
    const sub = subgraph(network, nodes);

    let isBip = isBipartite(nodes, network);
    if (!isBip) return false;

    let [partA, partB] = isBip;
    let [lenA, lenB] = [partA.length, partB.length];

    return lenA * lenB == sub.edges().length;
}
