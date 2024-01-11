import {findFans} from "./fan";
import Graph from "graphology";

test("fans", () => {
        let graph = new Graph();
        graph.addNode(1)
        graph.addNode(2)
        graph.addNode(3)
        graph.addNode(4)
        graph.addNode(5)
        graph.addNode(6)
        graph.addNode(7)

        graph.addEdge(1, 2)
        graph.addEdge(1, 3)
        graph.addEdge(1, 4)
        graph.addEdge(1, 5)
        graph.addEdge(2, 6)
        graph.addEdge(2, 7)

        let fans = findFans(graph);

        // for (let fan of fans) {
        //     console.log(1000, fan)
        // }
        // expect(nodes.every(n =>  typeof(n.louvain) === "number" )).toBe(true);
    }
)