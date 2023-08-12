import Graph from "graphology";
import {isBiClique, isBiCliques, isBipartite} from "./bipartite";


let graph = new Graph();
graph.addNode(1)
graph.addNode(2)
graph.addNode(3)
graph.addNode(4)
graph.addNode(5)
graph.addNode(6)
graph.addNode(7)

graph.addEdge(1, 6)
graph.addEdge(1, 4)
graph.addEdge(1, 5)
graph.addEdge(2, 5)
graph.addEdge(2, 4)
graph.addEdge(2, 6)
graph.addEdge(3, 6)

graph.addEdge(3, 7)
graph.addEdge(6, 7)


test("bipartite", () => {
        let isBip = isBipartite([1, 2, 3, 4, 5, 6], graph);
        expect(isBip).toBeTruthy();

        let isBip2 = isBipartite([3, 6, 7], graph);
        expect(isBip2).toBeFalsy();
    }
)


test("biclique", () => {
        let isBicl = isBiClique([1, 2, 4, 5, 6], graph);
        expect(isBicl).toBeTruthy();

        let isBip2 = isBipartite([3, 6, 7], graph);
        expect(isBip2).toBeFalsy();
    }
)

