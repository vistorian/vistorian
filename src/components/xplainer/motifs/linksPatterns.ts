import Graph from "graphology";

import {Hub, ParallelLinks, StrongLink, WeakLink} from "./motif";
import {calculateMean, calculateStandardDeviation} from "./utils";

const WEIGHT_THRESHOLD = 4;

export function* findStrongLinks(network: Graph): Generator<StrongLink> {
    for (let edge of network.edges()) {
        // TODO: key of weight is currently 'value'
        let weight = network.getEdgeAttribute(edge, "value");
        if (weight > WEIGHT_THRESHOLD) {
            yield new StrongLink([edge]);
        }
    }
}

export function* findWeakLinks(network: Graph): Generator<WeakLink> {
    for (let edge of network.edges()) {
        let weight = network.getEdgeAttribute(edge, "value");
        if (weight == 1) {
            yield new WeakLink([edge]);
        }
    }
}

function hashSourceTarget(source: string, target: string) {
    if (source < target) {
        return source.concat(target);
    } else {
        return target.concat(source);
    }
}

export function* findParallelLinks(network: Graph): Generator<StrongLink> {
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
        if (edges.length > 1) {
            yield new ParallelLinks(edges);
        }
    }
}