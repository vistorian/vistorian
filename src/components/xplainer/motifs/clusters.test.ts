import Graph from "graphology";
import {MBGraph} from "./cliques.test";
import {findClusters} from "./clusters";

test("cluster", () => {
        let graph: Graph = MBGraph();
        let c = findClusters(graph);

        // for (let clu of c) {
        //     console.log(1000, clu.nodes)
        // }
    }
)