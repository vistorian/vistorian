import Graph from "graphology";
import {Fan} from "./motif";

export function* findFans(network: Graph) {
    let nodes = network.nodes();
    let leaves: Set<any>;

    for (let node of nodes) {
        let neighbors = network.neighbors(node);
        if (neighbors.length > 2) {
            leaves = new Set();

            neighbors.forEach(neighbor => {
                let neighs2 = network.neighbors(neighbor)
                if (neighs2.length == 1) {
                    leaves.add(neighbor)
                }
            })

            if (leaves.size >= 2) {
                yield new Fan([node, ...leaves])
            }
        }
    }
}