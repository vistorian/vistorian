import {NodeId} from "./patternDetectors";
import Graph, {NodeKey, UndirectedGraph} from "graphology";

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


class TreeNode {
    children: Map<number, TreeNode>;
    biclique: number[];

    constructor() {
        this.children = new Map<number, TreeNode>();
        this.biclique = [];
    }
}

class GeneralizedSuffixTree {
    root: TreeNode;

    constructor() {
        this.root = new TreeNode();
    }

    insert(suffix: number[]) {
        let node = this.root;
        for (const vertex of suffix) {
            if (!node.children.has(vertex)) {
                node.children.set(vertex, new TreeNode());
            }
            node = node.children.get(vertex)!;
        }
        node.biclique = suffix;
    }

    search(suffix: number[]): TreeNode | null {
        let node = this.root;
        for (const vertex of suffix) {
            if (!node.children.has(vertex)) {
                return null;
            }
            node = node.children.get(vertex)!;
        }
        return node;
    }
}

export function findMaximalInducedBicliques(G: Graph): number[][] {
    const n = G.size;

    // random ordering
    const ordering = G.nodes();
    console.log(n)

    const T = new GeneralizedSuffixTree();
    for (let i = 0; i < n; i++) {

        // Check edges and formula
        const GiNodes = [...ordering.slice(i, i + 1), ...ordering.slice(i + 1)]; // Construct Gi according to Definition 1.
        const Gi = subgraph(G, GiNodes)

        // let GiUn = Gi.to

        console.log("Independant")
        const independentSets = findAllMaximalIndependentSets(Gi);
        console.log("Independant2")
        for (const I of independentSets) {
            if (I.length > 0) {
                T.insert(I);
                const existingI = T.search(I);
                if (existingI === null) {
                    console.log("Output:", I); // Output the maximal induced biclique.
                }
            }
        }
    }
    // Return all maximal induced bicliques found.
    return [];
}

export function findAllMaximalIndependentSets(G: Graph): string[][] {
    const independentSets: string[][] = [];
    const exploredSets = new Set<string>();

    function isIndependentSet(nodes: string[]): boolean {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (G.hasEdge(nodes[i], nodes[j]) || (G.hasEdge(nodes[j], nodes[i]))) {
                    return false;
                }
            }
        }
        return true;
    }

    function findMaximalIndependentSets(
        currentSet: string[],
        remainingNodes: string[]
    ) {
        if (isIndependentSet(currentSet)) {
            const sortedSet = [...currentSet].sort().join(',');
            if (!exploredSets.has(sortedSet)) {
                independentSets.push([...currentSet]);
                exploredSets.add(sortedSet);
            }
        }

        if (remainingNodes.length === 0) {
            return;
        }

        const node = remainingNodes.pop();

        // Include the node in the current set
        currentSet.push(node!);
        findMaximalIndependentSets(currentSet, [...remainingNodes]);

        // Exclude the node from the current set
        currentSet.pop();
        findMaximalIndependentSets(currentSet, [...remainingNodes]);
    }

    const allNodes = [...G.nodes()];
    findMaximalIndependentSets([], allNodes);

    return independentSets;
}

