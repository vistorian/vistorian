import Graph from "graphology";

import {Burst, Hub, RepeatedLinks} from "./motif";
import {findParallelLinks} from "./linksPatterns";


export function* findRepeatedLinks(network: Graph, timeKey: string = "Date"): Generator<RepeatedLinks> {
    // @ts-ignore
    for (let pl of findParallelLinks(network)) {
        let times = pl.links.map(link => link[timeKey]);
        let timesSet = new Set(times);

        if (timesSet.size > 1) {
            yield new RepeatedLinks(pl.links)
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


export function* findBursts(network: Graph, timeKey: string = "Date"): Generator<Burst> {
    for (let node of network.nodes()) {
        let edges = network.edges(node);

        let timeToEdges : Record<string, string[]> = {};
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

