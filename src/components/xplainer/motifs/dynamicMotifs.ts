import Graph from "graphology";

import {BackAndForth, Burst, Hub, ParallelLinks, RepeatedLinks} from "./motif";
import {findParallelLinks, hashSourceTarget} from "./linksPatterns";



function getStaticNodeId(dynNodeId: string) {
    return dynNodeId.split(" (")[0]
}

// Use the data model of netpen for dynamic networks
export function* findRepeatedLinksAndBFonDynNetPan(network: Graph, timeKey: string = "Date"): Generator<RepeatedLinks> {
    let sourceTargetToEdge: Record<string, string[]> = {};

    for (let edge of network.edges()) {
        let [source, target] = network.extremities(edge);
        // console.log(network.getNodeAttributes(source))
        let [sourceStatic, targetStatic] = [getStaticNodeId(source), getStaticNodeId(target)]

        // console.log(source, sourceStatic)

        // let [sourceNode, targetNode] = [network.no(source), network.nodes(target)]
        let hash = hashSourceTarget(sourceStatic, targetStatic);
        // console.log(hash)

        if (sourceTargetToEdge[hash]) {
            sourceTargetToEdge[hash].push(edge)
        } else {
            sourceTargetToEdge[hash] = [edge]
        }
    }

    loop:
    for (let edges of Object.values(sourceTargetToEdge)) {
        let times = edges.map(link => network.getEdgeAttribute(link, "data")[timeKey]);
        let timesSet = new Set(times);
        // console.log("TT ", times)

        if (timesSet.size > 1) {
            let s;
            let t;
            let isBF = false;
            for (let link of edges) {
                if (!s) {
                    [s, t] = network.extremities(link)
                } else {
                    let [source2, target2] = network.extremities(link)
                    if (s == target2) {
                        isBF = true;
                    }
                }
            }

            if (isBF) {
                yield new BackAndForth(edges);
            } else {
                yield new RepeatedLinks(edges);
            }
        }
    }
}


export function* findRepeatedLinksAndBF(network: Graph, timeKey: string = "Date"): Generator<RepeatedLinks> {
    loop:
    for (let pl of findParallelLinks(network)) {
        let times = pl.links.map(link => network.getEdgeAttribute(link, "data")[timeKey]);

        let timesSec = times.map(t => new Date(t))
        let timesSet = new Set(timesSec);
        // let timesSet = new Set(times);

        // for (let edge of network.edges()) {
        //     console.log(111, network.getEdgeAttributes(edge))
        // }

        if (timesSet.size > 1) {
        // if (times.length > 1) {
            let source;
            let target;
            for (let links of pl.links) {
                if (!source) {
                    [source, target] = network.extremities(links)
                } else {
                    let [source2, target2] = network.extremities(links)
                    if ((source == target2) && (target == source2)) {
                        // yield new BackAndForth(pl.links)
                        continue loop;
                    }
                }
            }

            // yield new RepeatedLinks(pl.links)
        }
    }

    // let parallelLinks = findParallelLinks(network);
    // let repeatedLinks =  Array.from( parallelLinks ).map(pl => {
    //     let times = pl.edges.map(edge => edge[timeKey]);
    //     let timesSet = new Set(times);
    //
    //     return (timesSet.size > 1) ? new ReapeatedLinks(pl.edges) : null;
    // })
    //
    // repeatedLinks = repeatedLinks.filter(rl => rl);
    // return repeatedLinks;
}

export function* findRepeatedLinks(network: Graph, timeKey: string = "Date"): Generator<RepeatedLinks> {
    for (let pl of findParallelLinks(network)) {
        let times = pl.links.map(link => link[timeKey]);
        let timesSet = new Set(times);

        if (timesSet.size > 1) {
            yield new RepeatedLinks(pl.links)
        }
    }
}


export function* findBackandForth(network: Graph, timeKey: string = "Date") {
    loop:
        for (let rl of findRepeatedLinks(network)) {
            let source, target;
            for (let links of rl.links) {
                if (!source) {
                    [source, target] = network.extremities(links)
                } else {
                    let [source2, target2] = network.extremities(links)
                    if ((source == target2) && (target == source2)) {
                        yield new BackAndForth(rl.links)
                        continue loop;
                    }
                }
            }
        }
}


export function* findBursts(network: Graph, timeKey: string = "Date"): Generator<Burst> {
    for (let node of network.nodes()) {
        let edges = network.edges(node);

        let timeToEdges: Record<string, string[]> = {};
        for (let edge of edges) {
            let time = network.getEdgeAttribute(edge, "data")[timeKey]
            if (timeToEdges[time]) {
                timeToEdges[time].push(edge);
            } else {
                timeToEdges[time] = [edge];
            }
        }

        for (let edges of Object.values(timeToEdges)) {
            // TODO: threshold
            if (edges.length > 2) {
                yield new Burst([node], edges);
            }
        }
    }
}

