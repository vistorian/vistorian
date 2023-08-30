import Graph from "graphology";

import {BackAndForth, Burst, Hub, RepeatedLinks} from "./motif";
import {findParallelLinks} from "./linksPatterns";


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
        console.log(111, pl)

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
                        yield new BackAndForth(pl.links)
                        continue loop;
                    }
                }
            }

            yield new RepeatedLinks(pl.links)
        }
    }
    console.log("dddd")

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

