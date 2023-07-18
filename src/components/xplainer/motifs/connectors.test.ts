import {findCliques} from "./cliques";
import Graph from "graphology";
import {findConnectors} from "./findConnectors";

test("clique", () => {
        let graph = new Graph();
        graph.addNode(1)
        graph.addNode(2)
        graph.addNode(3)
        graph.addNode(4)
        graph.addNode(5)
        graph.addNode(6)

        graph.addEdge(1, 2)
        graph.addEdge(1, 3)
        graph.addEdge(1, 4)
        graph.addEdge(1, 5)
        graph.addEdge(6, 2)
        graph.addEdge(6, 3)
        graph.addEdge(6, 4)
        graph.addEdge(6, 5)

        let c = findConnectors(graph);

        for (let cli of c) {
            console.log(1000, cli)
        }
        // expect(nodes.every(n =>  typeof(n.louvain) === "number" )).toBe(true);
    }
)