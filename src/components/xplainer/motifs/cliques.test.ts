import {findCliques} from "./cliques";
import Graph from "graphology";
import MBNetpanNetwork  from "./templates/mb-NETPAN-static-network.json";
import {PatternDetectors} from "./patternDetectors";


function MBGraph() {
    // @ts-ignore
    let patternDetector = new PatternDetectors(MBNetpanNetwork);

    return patternDetector.graph;
}

test("clique", () => {
        let graph = new Graph();
        graph.addNode(1)
        graph.addNode(2)
        graph.addNode(3)
        graph.addNode(4)
        graph.addNode(5)
        graph.addNode(6)

        graph.addEdge(1, 2)
        graph.addEdge(2, 3)
        graph.addEdge(1, 3)
        graph.addEdge(3, 4)
        graph.addEdge(4, 5)
        graph.addEdge(5, 6)
        graph.addEdge(4, 6)

        let c = findCliques(graph);

        for (let cli of c) {
            console.log(1000, cli.nodes)
        }
        // expect(nodes.every(n =>  typeof(n.louvain) === "number" )).toBe(true);
    }
)

test("MB", () => {
        let graph: Graph = MBGraph();
        let c = findCliques(graph);
        console.log(c)

        // for (let cli of c) {
        //     console.log(1000, cli.nodes)
        // }
        // expect(nodes.every(n =>  typeof(n.louvain) === "number" )).toBe(true);
    }
)