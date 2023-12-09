import Graph, {NodeKey} from "graphology";
import {Simulate} from "react-dom/test-utils";
import {clone} from "lodash";
import subgraph from "graphology-operators/subgraph";
import {connectedComponents} from 'graphology-components';


import {node} from "graphology-metrics";
import {isBiClique} from "./bipartite";
import {includes} from "lodash-es";
import {BiClique} from "./motif";


function allNeighbors(G: Graph, nodes: NodeKey[]) {
    let allNeigh = new Set()
    nodes.forEach(n => {
        let N = G.neighbors(n);
        N.forEach(n => allNeigh.add(n));
    })
    return [...allNeigh]
}

function isIncluded(x: any[], y: any[]) {
    for (let n of x) {
        if (!y.includes(n)) {
            return false;
        }
    }
    return true;
}

//  Order of nodes is defined as 0, ..., n
// function orderValue(node: NodeKey, G: Graph) {
function orderValue(node: NodeKey, orderedNodes) {
    // let nodes = G.nodes();
    // return nodes.indexOf(node)
    return orderedNodes.indexOf(node)
}

function union(A: any[], B: any[]) {
    return [...new Set(A.concat(B))]
}

export function leastBiclique(G: Graph, bipartiteSetA: NodeKey[], bipartiteSetB: NodeKey[], nodesOrdered) {
    if (bipartiteSetB.length == 0) {
        let NA = allNeighbors(G, bipartiteSetA);
        if (NA.length == 0) {
            return [];
        } else {
            let i = 1;
            // let nodes = G.nodes().filter(n => !bipartiteSetB.includes(n))
            let nodes = nodesOrdered.filter(n => !bipartiteSetB.includes(n))
            // console.log(nodes, nodes2)

            while (bipartiteSetB.length == 0) {
                if (i == nodes.length + 1) return [];

                // CHECK
                // let j = nodes[nodes.length - i];
                let j = nodes[i - 1];

                let neighj = G.neighbors(j);
                // let neighjBar = G.nodes().filter(n => !neighj.concat(j).includes(n));
                let neighjBar = nodesOrdered.filter(n => !neighj.concat(j).includes(n));
                if (isIncluded(bipartiteSetA, neighjBar) && allNeighbors(G, bipartiteSetA).filter(n => neighj.includes(n)).length > 0) {
                    if (!bipartiteSetA.includes(j)) bipartiteSetA.push(j);
                }
                if (isIncluded(bipartiteSetA, neighj)) {
                    bipartiteSetB = [j];
                }
                i++;
            }
        }
    }
    // console.log("AA", bipartiteSetA, bipartiteSetB)
    let A2 = clone(bipartiteSetA);
    let B2 = clone(bipartiteSetB);

    let AuB = [...new Set(bipartiteSetA.concat(bipartiteSetB))];
    // let nodes = G.nodes().filter(n => !AuB.includes(n));
    let nodes = nodesOrdered.filter(n => !AuB.includes(n));
    for (let node of nodes) {
        // if (orderValue(node, G) == 0) {
        if (orderValue(node, nodesOrdered) == 0) {
            continue;
        }

        let neigh = G.neighbors(node);
        // let neighBar = G.nodes().filter(n => !neigh.concat(node).includes(n));
        let neighBar = nodesOrdered.filter(n => !neigh.concat(node).includes(n));
        if (isIncluded(A2, neighBar) && isIncluded(B2, neigh)) {
            if (!A2.includes(node)) A2.push(node);
        }
        if (isIncluded(B2, neighBar) && isIncluded(A2, neigh)) {
            if (!B2.includes(node)) B2.push(node);
        }
    }

    return [A2, B2]
}

export function* findBicliques(G: Graph) {
    const components = connectedComponents(G);
    for (let component of components) {
        let subg = subgraph(G, component);
        let bicliques = lexBicliques(subg);
        yield* bicliques;
    }
}


export function* lexBicliques(G: Graph) {
    let leastBC = leastBiclique(G, [G.nodes()[0]], [], G.nodes());
    leastBC = union(leastBC[0], leastBC[1])
    let Q = clone(leastBC);

    let Gnodes = G.nodes()

    let iter = 0;
    while (Q.length > 0) {
        // console.log(Q)

        let Qgraph = subgraph(G, Q);
        let Qnodes = Qgraph.nodes()
        Qnodes.sort((n1, n2) => {
            // return orderValue(n1, G) - orderValue(n2, G)
            return orderValue(n1, Gnodes) - orderValue(n2, Gnodes)
        })

        // let [X, Y] = leastBiclique(Qgraph, [Qgraph.nodes()[0]], []);
        let [X, Y] = leastBiclique(Qgraph, [Qnodes[0]], [], Qnodes);
        // let [X, Y] = leastBiclique(G, [Qnodes[0]], []);
        if (!X) X = [];
        if (!Y) Y = [];

        let B = union(X, Y)

        // Added as sometimes it goes into infinite loop
        if (B.length == 0 || iter >= 100) {
            return;
        }
        let biclique = new BiClique([]);
        biclique.setNodesSetA(X)
        biclique.setNodesSetB(Y)

        if (X.length > 1 && Y.length > 1) {
            console.log("BI ", biclique)
            yield biclique;
        }

        Q = Q.filter(n => !B.includes(n));

        // for (let nodej of G.nodes().filter(n => !B.includes(n))) {
        for (let nodej of Gnodes.filter(n => !B.includes(n))) {
            let nodeToj = [];
            // for (let n of G.nodes()) {
            for (let n of Gnodes) {
                nodeToj.push(n);
                if (n == nodej) break;
            }

            let Xj = X.filter(n => nodeToj.includes(n));
            let Yj = Y.filter(n => nodeToj.includes(n));
            let Bj = union(Xj, Yj)

            let k = 0
            while (k < 2) {
                let neighj = G.neighbors(nodej);
                let neighjBar = G.nodes().filter(n => !neighj.concat(nodej).includes(n));
                // console.log("NNN", nodej, neighj, neighjBar)
                if (Xj.filter(n => neighj.includes(n)).length > 0 || Yj.filter(n => neighjBar.includes(n)).length > 0 || Yj.length == 0) {
                    let Xj2 = union(Xj.filter(n => !neighj.includes(n)), [nodej]);
                    let Yj2 = Yj.filter(n => !neighjBar.includes(n));

                    let nodesfilter = nodeToj.slice(0, -1).filter(n => !Bj.includes(n));

                    let isBCAll = false;
                    for (let nodel of nodesfilter) {

                        let bicliqueTest = union(union(Xj2, Yj2), [nodel]);
                        let subg = subgraph(G, bicliqueTest);

                        let isBC = isBiClique(bicliqueTest, subg);

                        isBCAll = isBCAll || isBC

                        if (isBC) {
                            console.log("dede ", subg)
                            break
                        }
                    }

                    if (!isBCAll) {
                        let leastBC = leastBiclique(G, Xj2, Yj2, Gnodes);
                        // let leastBC = leastBiclique(G, Xj2, Yj2, G.nodes());

                        // leastBC = union(leastBC[0], leastBC[1]);
                        if (leastBC.length > 0 && isIncluded(union(leastBC[0], leastBC[1]), Q)) {
                            leastBC = union(leastBC[0], leastBC[1]);
                            Q = union(Q, leastBC)
                        } else if (leastBC.length == 0 && Yj2.length == 0) {
                            for (let node of neighj) {
                                let XX = G.neighbors(node).filter(n => Xj2.includes(n))
                                let leastBC2 = leastBiclique(G, XX, [node], G.nodes());
                                if (leastBC2.length > 0) leastBC2 = union(leastBC2[0], leastBC2[1])

                                Q = union(Q, leastBC2)
                            }
                        }
                    }

                }
                k++;
                [Xj, Yj] = [Yj, Xj];
            }
        }

        iter++;
    }
}