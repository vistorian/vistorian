import Graph, {NodeKey} from "graphology";
import {Simulate} from "react-dom/test-utils";
import {clone} from "lodash";
import subgraph from "graphology-operators/subgraph";
import {connectedComponents} from 'graphology-components';


import {node} from "graphology-metrics";
import {isBiClique, isBipartiteBiclique} from "./bipartite";
import {includes} from "lodash-es";
import {BiClique} from "./motif";
import {sort} from "d3";
import {time} from "html2canvas/dist/types/css/types/time";


function allNeighbors(G: Graph, nodes: NodeKey[]) {
    // let allNeigh = new Set()
    // nodes.forEach(n => {
    //     let N = G.neighbors(n);
    //     N.forEach(n => allNeigh.add(n));
    // })
    // return [...allNeigh]

    let allNeigh = [G.neighbors(nodes[0])];
    nodes.slice(1).forEach(n => {
        let N = G.neighbors(n);
        allNeigh = allNeigh.filter(n => N.includes(n));
    })
    return allNeigh
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


const memo = new Map();
export function union(A: any[], B: any[]) {
    const key = `${A}|${B}`;
    if (memo.has(key)) {
        return memo.get(key);
    }

    // console.log(A, B)
    let union = [...new Set(A.concat(B))]
    memo[key] = union;

    return union;
}


const memoInter = new Map();
export function intersect(A: any[], B: any[]) {
    const key = `${A}|${B}`;
    if (memoInter.has(key)) {
        return memoInter.get(key);
    }

    // console.log(A, B)
    let inter = A.filter(n => B.includes(n))
    memoInter[key] = inter;

    return inter;
}


// const memoInter = new Map();
export function inter(A: any[], B: any[]) {
    const key = `${A}|${B}`;
    if (memo.has(key)) {
        return memo.get(key);
    }

    // console.log(A, B)
    let union = [...new Set(A.concat(B))]
    memo[key] = union;

    return union;
}

export function leastBiclique(G: Graph, bipartiteSetA: NodeKey[], bipartiteSetB: NodeKey[], nodesOrdered) {
    if (bipartiteSetB.length == 0) {
        let NA = allNeighbors(G, bipartiteSetA);
        if (NA.length == 0) {
            return [];
        } else {
            let i = 0;
            // let nodes = G.nodes().filter(n => !bipartiteSetB.includes(n))
            let nodes = nodesOrdered.filter(n => !bipartiteSetA.includes(n))
            // console.log(nodes, nodes2)

            // console.log(33, nodes, bipartiteSetA)

            while (bipartiteSetB.length == 0) {
                let j = nodes[i];

                let neighj = G.neighbors(j);
                let neighjBar = G.nodes().filter(n => !neighj.concat(j).includes(n));
                // let neighjBar = nodesOrdered.filter(n => !neighj.concat(j).includes(n));
                if (isIncluded(bipartiteSetA, neighjBar) && allNeighbors(G, bipartiteSetA).filter(n => neighj.includes(n)).length > 0) {
                    if (!bipartiteSetA.includes(j)) bipartiteSetA.push(j);
                }

                // console.log(j, neighj, neighjBar, bipartiteSetA)


                if (isIncluded(bipartiteSetA, neighj)) {
                    bipartiteSetB = [j];
                }

                i++
            }

            // while (bipartiteSetB.length == 0) {
            //     if (i == nodes.length + 1) return [];
            //
            //     // CHECK
            //     // let j = nodes[nodes.length - i];
            //     let j = nodes[i - 1];
            //
            //     let neighj = G.neighbors(j);
            //     let neighjBar = G.nodes().filter(n => !neighj.concat(j).includes(n));
            //     // let neighjBar = nodesOrdered.filter(n => !neighj.concat(j).includes(n));
            //     if (isIncluded(bipartiteSetA, neighjBar) && allNeighbors(G, bipartiteSetA).filter(n => neighj.includes(n)).length > 0) {
            //         if (!bipartiteSetA.includes(j)) bipartiteSetA.push(j);
            //     }
            //     if (isIncluded(bipartiteSetA, neighj)) {
            //         bipartiteSetB = [j];
            //     }
            //     i++;
            // }
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

let start;
let timeNow;
export function* findBicliques(G: Graph) {
    start = new Date().getTime();

    const components = connectedComponents(G);
    for (let component of components) {
        let subg = subgraph(G, component);
        let bicliques = lexBicliques(subg);
        yield* bicliques;
    }
}


function lexicographicOrder(a, b, orderCb: Function) {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        let r = orderCb(a[i]) - orderCb(b[i]);
        if (r != 0) {
            return r;
        }
    }
}

function sortQ(Q: [], orderNodes: []) {
    const orderCb = (node) => {
        return orderValue(node, orderNodes)
    }

    // console.log(11, Q)
    Q.sort((bc1, bc2) => {

        let bcFlat1 = union(bc1[0], bc1[1])
        bcFlat1.sort((a, b) => {
            return orderCb(a) - orderCb(b)
        })

        let bcFlat2 = union(bc2[0], bc2[1])
        bcFlat2.sort((a, b) => {
            return orderCb(a) - orderCb(b)
        })

        return lexicographicOrder(bcFlat1, bcFlat2, orderCb)
        // return lexicographicOrder(bc1, bc2, orderCb)
    })
}

function arraysContainSameValues<T>(array1: T[], array2: T[]): boolean {
    // console.time("contain")
  // Check if both arrays have the same length
  if (array1.length !== array2.length) {
    return false;
  }

  // Sort the arrays before comparing
  // const sortedArray1 = [...array1].sort();
  // const sortedArray2 = [...array2].sort();

  array1.sort();
  array2.sort();

  // Compare each element in the sorted arrays
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
    // console.timeEnd("contain")

      return false;
    }
  }

  // If all elements are equal, return true
    // console.timeEnd("contain")
  return true;
}


function isBCinQ(bc, Q) {
    for (const bc2 of Q) {
        const isEq = arraysContainSameValues(union(bc[0], bc[1]), union(bc2[0], bc2[1]))
        if (isEq) return true;
    }
    return false;
}

export function* lexBicliques(G: Graph) {
    let Gnodes = G.nodes()
    // console.log("order ", Gnodes)

    let leastBC = leastBiclique(G, [Gnodes[0]], [], Gnodes);
    let Q = [leastBC]
    // let foundBicliques = [leastBC];
    let foundBicliques = [];

    whileLoop:
    while (Q.length > 0) {

        timeNow = new Date().getTime();
        // If more than two hours
        if (timeNow - start > 1000 * 3600 * 2) {
        // if (timeNow - start > 100) {
            console.log("BREAK")
            return;
        }


        sortQ(Q, Gnodes);

        let [X, Y] =  Q.shift();

        // console.log([X, Y], foundBicliques)
        for (let bc of foundBicliques) {
            if (arraysContainSameValues(union(bc[0], bc[1]), union(X, Y))) {
                continue whileLoop;
            }
        }

        // let [X, Y] = leastBiclique(Qgraph, [Qgraph.nodes()[0]], []);
        // let [X, Y] = leastBiclique(Qgraph, [Qnodes[0]], [], Qnodes);
        // let [X, Y] = leastBiclique(G, [Qnodes[0]], []);
        if (!X) X = [];
        if (!Y) Y = [];

        let B = union(X, Y)

        // Added as sometimes it goes into infinite loop
        // if (B.length == 0 || iter >= 100) {
        if (B.length == 0) {
            return;
        }
        let biclique = new BiClique([]);
        biclique.setNodesSetA(X)
        biclique.setNodesSetB(Y)

        if (X.length > 0 && Y.length > 0) {
            foundBicliques.push([X, Y])
            // console.log("BI ", biclique)

            // if (X.length > 1 && Y.length > 1) {
            if (X.length > 1 && Y.length > 1) {
                yield biclique;
            }
        }

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
            // let Bj = union(Xj, Yj)

            // let nodesfilter = nodeToj.filter(n => !Bj.includes(n));

            let k = 0
            while (k < 2) {
                let neighj = G.neighbors(nodej);
                let neighjBar = Gnodes.filter(n => !neighj.concat(nodej).includes(n));
                // console.log("NNN", nodej, neighj, neighjBar)
                if (Xj.filter(n => neighj.includes(n)).length > 0 || Yj.filter(n => neighjBar.includes(n)).length > 0 || Yj.length == 0) {
                // if (Xj.filter(n => neighj.includes(n)).length > 0 || Yj.filter(n => neighjBar.includes(n)).length > 0) {
                    let Xj2 = union(Xj.filter(n => !neighj.includes(n)), [nodej]);
                    let Yj2 = Yj.filter(n => !neighjBar.includes(n));

                    // let nodesfilter = nodeToj.slice(0, -1).filter(n => !Bj.includes(n));

                    // let nodesfilter = nodeToj.filter(n => !Bj.includes(n));
                    // let nodesfilter = nodeToj.filter(n => !Bj.includes(n) && !Yj2.includes(n) && !Xj2.includes(n));
                    let nodesfilter = nodeToj.filter(n => !(Xj.includes(n) || Yj.includes(n)) && !Yj2.includes(n) && !Xj2.includes(n));

                    let isBCAll = false;

                    // console.log("NODE L LOOP")
                    for (let nodel of nodesfilter) {
                        let bcTest1 = leastBiclique(G, Xj2.concat(nodel), Yj2, Gnodes)
                        let bcTest2 = leastBiclique(G, Xj2, Yj2.concat(nodel), Gnodes)

                        // let isBC1 = bcTest1.length > 0 ? isBiClique(union(bcTest1[0], bcTest1[1]), subgraph(G, union(bcTest1[0], bcTest1[1])), true) : false
                        // let isBC2 = bcTest2.length > 0 ? isBiClique(union(bcTest2[0], bcTest2[1]), subgraph(G, union(bcTest2[0], bcTest2[1])), true) : false

                        let isBC1 = bcTest1.length > 0 ? isBipartiteBiclique(bcTest1[0], bcTest1[1], G) : false
                        let isBC2 = bcTest2.length > 0 ? isBipartiteBiclique(bcTest2[0], bcTest2[1], G) : false

                        // let isBC1 = bcTest1.length > 0
                        // let isBC2 = bcTest2.length > 0

                        let isBC = isBC1 || isBC2;

                        // TEST if union with l is a biclique (previous way tested)
                        // let bicliqueTest = union(union(Xj2, Yj2), [nodel]);
                        // let subg = subgraph(G, bicliqueTest);
                        // let isBC = isBiClique(bicliqueTest, subg);

                        isBCAll = isBCAll || isBC



                        if (isBC) {
                            // if (isBC1) {
                            //     Q.push(bcTest1)
                            // }
                            // if (isBC2) {
                            //     Q.push(bcTest2)
                            // }

                            // console.log("dede ", subg)
                            break
                        }
                    }
                    // console.log("NODE L LOOP END")

                    if (!isBCAll) {
                        let leastBC = leastBiclique(G, Xj2, Yj2, Gnodes);
                        // let leastBC = leastBiclique(G, Xj2, Yj2, G.nodes());

                        // leastBC = union(leastBC[0], leastBC[1]);
                        // if (leastBC.length > 0 && isIncluded(union(leastBC[0], leastBC[1]), Q)) {
                        if (leastBC.length > 0 && !isBCinQ(leastBC, Q)) {

                            // if (leastBC[0].length > 1 && leastBC[1].length > 1) {
                                Q.push(leastBC)
                            // }

                            // let included = false;
                            // foundBicliques.forEach(bc => {
                            //         if (arraysContainSameValues(union(bc[0], bc[1]), union(leastBC[0], leastBC[1]))) {
                            //             included = true;
                            //         }
                            //     })
                            // if (!included) {
                            //     Q.push(leastBC)
                            //     foundBicliques.push([leastBC[0], leastBC[1]]);
                            // }

                        } else if (leastBC.length == 0 && Yj2.length == 0) {
                        // } else if (false) {

                            // console.log("node j loop")
                            for (let node of neighj) {
                                let XX = G.neighbors(node).filter(n => Xj2.includes(n))
                                let leastBC2 = leastBiclique(G, XX, [node], Gnodes);

                                if (leastBC2.length > 0 && !isBCinQ(leastBC2, Q)) {

                                    // if (leastBC2[0].length > 1 && leastBC2[1].length > 1) {
                                        Q.push(leastBC2)
                                    // }

                                    // let included = false;
                                    // foundBicliques.forEach(bc => {
                                    //     if (arraysContainSameValues(union(bc[0], bc[1]), union(leastBC2[0], leastBC2[1]))) {
                                    //         included = true;
                                    //     }
                                    // })
                                    //
                                    // if (!included) {
                                    //     Q.push(leastBC2)
                                    //     foundBicliques.push([leastBC2[0], leastBC2[1]]);
                                    // }
                                }
                            }
                            // console.log("node j loop END")
                        }
                    }

                }
                k++;
                [Xj, Yj] = [Yj, Xj];
            }
        }
    }
}