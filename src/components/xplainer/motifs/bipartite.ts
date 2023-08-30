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


export function* findBipartite(graph: Graph) {
    for (const node of graph.nodes()) {
        rec(graph, [node], graph.neighbors(node))
        graph.dropNode(node)
    }
}

// function rec(G, S, C) {
//     return S;
//
//     while
// }

// Procedure Main(G = (V, E))
// 2 foreach v ∈ V do
// 3 Rec(G, {v} , N(v));
// 4 G ← G \ {v};
// 5 Subprocedure Rec(G, S, C (S, G))
// 6 output(S);
// 7 while C (S, G) 6= ∅ do
// 8 u ← the smallest child generator in C (S, G);
// 9 C (S, G) ← C (S, G) \ {u};
// 10 S
// 0 ← S ∪ {u};
// 11 Rec(G, S0
// , ComputeChildGen(C (S, G), u, G));
// 12 G ← G \ {u};
// 13 Subprocedure ComputeChildGen(C (S, G), u, G)
// 14 if u ∈ CL (S, G) then
// 15 C (S ∪ {u} , G) ← C (S, G) \ (CL (S, G) ∩ N(u));
// 16 else if u ∈ CR (S, G) then
// 17 C (S ∪ {u} , G) ← C (S, G) \ (CR (S, G) ∩ N(u));
// 18 C (S ∪ {u} , G) ← C (S ∪ {u} , G) ∪ Γ (S, u, G);
// 19 return C (S ∪ {v} , G);
