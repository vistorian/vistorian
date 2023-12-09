import {findCliques} from "./cliques";
import Graph from "graphology";
// import MBNetpanNetwork  from "./templates/mb-NETPAN-static-network.json";
import MBNetpanNetwork  from "../../../../public/data/mb-NETPAN-static-network.json";
import miserablesNetpanNetwork  from "../../../../public/data/miserables-NETPAN-static-network.json";
import {PatternDetectors} from "./patternDetectors";


export function MBGraph() {
    // @ts-ignore
    let patternDetector = new PatternDetectors(MBNetpanNetwork);
    // return patternDetector.graph;
    return patternDetector.undirectedGraph;
}

export function miserables() {
    // @ts-ignore
    let patternDetector = new PatternDetectors(miserablesNetpanNetwork);
    return patternDetector.graph;
}


test("clique", () => {
        let graph = new Graph();
        graph.addNode(1)
        graph.addNode(2)
        graph.addNode(3)
        graph.addNode(4)
        graph.addNode(5)

        graph.addEdge(1, 2)
        graph.addEdge(1, 3)
        graph.addEdge(1, 4)
        graph.addEdge(1, 5)
        graph.addEdge(2, 3)
        graph.addEdge(2, 4)
        graph.addEdge(2, 5)
        graph.addEdge(3, 4)
        graph.addEdge(3, 5)
        graph.addEdge(4, 5)

        let c = findCliques(graph);

        for (let cli of c) {
            cli.extendLinks(graph);
            // console.log(1000, cli.nodes, cli.links)
        }
    }
)

test("MB", () => {
        let graph: Graph = MBGraph();
        let c = findCliques(graph);

        // for (let cli of c) {
        //     // cli.extendLinks(graph);
        //     console.log(1000, cli.nodes, cli.links)
        // }
    }
)