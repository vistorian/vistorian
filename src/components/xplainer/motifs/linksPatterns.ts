import Graph from "graphology";

import {ParallelLinks, SelfLink, StrongLink, WeakLink} from "./motif";
import {calculateMean, calculateStandardDeviation} from "./utils";

const WEIGHT_THRESHOLD = 5;


export function* findSelfLinks(network: Graph): Generator<StrongLink> {
    for (let edge of network.edges()) {
        let [source, target] = network.extremities(edge);
        if (source == target) {
            return new SelfLink([edge], network.getEdgeAttribute(edge, "linkWeight"))
        }
    }
}

export function* findStrongLinks(network: Graph): Generator<StrongLink> {
    let weightDist = []
    network.forEachEdge(edge => {
        let weight = network.getEdgeAttribute(edge, "linkWeight");
        if (!weight) weight = network.getEdgeAttribute(edge, "value");
        weightDist.push(weight);
    })
    let mean = calculateMean(weightDist);
    let std = calculateStandardDeviation(weightDist);

    for (let edge of network.edges()) {
        // TODO: key of weight
        let weight = network.getEdgeAttribute(edge, "linkWeight");
        if (!weight) weight = network.getEdgeAttribute(edge, "value");

        // if (weight > WEIGHT_THRESHOLD) {
        if (weight > mean + 2 * std)
            yield new StrongLink([edge], weight);
    }
}

export function* findWeakLinks(network: Graph): Generator<WeakLink> {
    let weightDist = []
    network.forEachEdge(edge => {
        let weight = network.getEdgeAttribute(edge, "linkWeight");
        weightDist.push(weight);
    })
    let mean = calculateMean(weightDist);
    let std = calculateStandardDeviation(weightDist);

    for (let edge of network.edges()) {
        let weight = network.getEdgeAttribute(edge, "linkWeight");
        if (weight == 1) {
            if (weight < mean - 2 * std)
                yield new WeakLink([edge], weight);
        }
    }
}

export function hashSourceTarget(source: string, target: string) {
    if (source < target) {
        return source.concat("-").concat(target);
    } else {
        return target.concat("-").concat(source);
    }
}

export function* findParallelLinks(network: Graph, isMatrix: boolean): Generator<ParallelLinks> {
    let sourceTargetToEdge: Record<string, string[]> = {};
    for (let edge of network.edges()) {
        let [source, target] = network.extremities(edge);
        let hash = hashSourceTarget(source, target);

        if (sourceTargetToEdge[hash]) {
            sourceTargetToEdge[hash].push(edge)
        } else {
            sourceTargetToEdge[hash] = [edge]
        }
    }

    for (let edges of Object.values(sourceTargetToEdge)) {
        if (isMatrix && edges.length > 2) {
            yield new ParallelLinks(edges, 0);
        }
        else if (!isMatrix && edges.length > 1) {
            yield new ParallelLinks(edges, 0);
        }
    }
}