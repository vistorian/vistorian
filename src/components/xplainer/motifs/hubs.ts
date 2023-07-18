import Graph from "graphology";
import {calculateMean, calculateStandardDeviation} from "./utils";
import {Bridge, Hub} from "./motif";
import betweennessCentrality from 'graphology-metrics/centrality/betweenness';


export function* findHubs(network: Graph): Generator<Hub> {
    let degreeDist: number[] = []
    network.forEachNode(node => {
        let degree = network.degree(node);
        degreeDist.push(degree);
    })

    let mean = calculateMean(degreeDist);
    let std = calculateStandardDeviation(degreeDist);

    // network.forEachNode(node => {
    //     let degree = network.degree(node);
    //     if (degree > mean + 2 * std) {
    //         yield new Hub([node], network);
    //     }
    // })

    for (let node of network.nodes()) {
        let degree = network.degree(node);
        if (degree > mean + 2 * std) {
            yield new Hub([node], network);
        }
    }
}

export function* findBridges(network: Graph): Generator<Bridge> {
    // To compute centrality for every node:
    const centralities = betweennessCentrality(network);

    let mean = calculateMean(Object.values(centralities));
    let std = calculateStandardDeviation(Object.values(centralities));

    for (let node of network.nodes()) {
        let bc = centralities[node];
        if (bc > mean + 2 * std) {
            yield new Bridge([node], network);
        }
    }
}