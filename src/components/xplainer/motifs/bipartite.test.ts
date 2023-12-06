import Graph, {UndirectedGraph} from "graphology";
import {
    findAllMaximalIndependentSets,
    findMaximalInducedBicliques,
    isBiClique,
    isBiCliques,
    isBipartite
} from "./bipartite";
import {findCliques} from "./cliques";
import {MBGraph, miserables} from "./cliques.test";
import {findBicliques, leastBiclique, lexBicliques} from "./bicliques";


let graph = new Graph();
graph.addNode(1)
graph.addNode(2)
graph.addNode(3)
graph.addNode(4)
graph.addNode(5)
graph.addNode(6)
graph.addNode(7)
graph.addNode(8)


graph.addEdge(1, 4)
graph.addEdge(1, 5)
graph.addEdge(2, 4)
graph.addEdge(2, 5)
graph.addEdge(3, 4)
graph.addEdge(3, 5)
graph.addEdge(5, 7)
graph.addEdge(5, 8)
graph.addEdge(6, 7)
graph.addEdge(6, 8)


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


test("maximalIndependantSet", () => {
        let graphPath = new UndirectedGraph();
        graphPath.addNode(1)
        graphPath.addNode(2)
        graphPath.addNode(3)
        graphPath.addNode(4)
        graphPath.addNode(5)

        graphPath.addEdge(1, 2)
        graphPath.addEdge(2, 3)
        graphPath.addEdge(3, 4)
        graphPath.addEdge(4, 5)

        let sets = findAllMaximalIndependentSets(graphPath)
        console.log(sets)
    }
)


function graphBicliques() {
    let graphData = new UndirectedGraph();
    graphData.addNode(1)
    graphData.addNode(2)
    graphData.addNode(3)
    graphData.addNode(4)
    graphData.addNode(5)
    graphData.addNode(6)
    graphData.addNode(7)
    graphData.addNode(8)
    graphData.addNode(9)

    // Biclique 1
    graphData.addEdge(5, 3)
    graphData.addEdge(6, 2)
    graphData.addEdge(5, 2)
    graphData.addEdge(6, 3)

    graphData.addEdge(1, 5)

    // Biclique 2
    graphData.addEdge(1, 4)
    graphData.addEdge(7, 4)
    graphData.addEdge(8, 1)
    graphData.addEdge(8, 7)
    graphData.addEdge(9, 1)
    graphData.addEdge(9, 7)

    return graphData
}


test("leastBiClique", () => {
        // let B =leastBiclique(graph, [], ["2"], ["4", "5"])
        let B = leastBiclique(graph, ["1"], [])
        console.log(B)

        let B2 = leastBiclique(graph, ["5"], [])
        console.log(B2)

        let B3 = leastBiclique(graph, ["8"], [])
        console.log(B3)
    }
)


test("findBiCliqueSimple", () => {
        let graph = graphBicliques();
        let B = findBicliques(graph)
        for (let bc of B) {
            console.log(bc)
        }
    }
)

test("findBiCliqueMiserable", () => {
        let graph = miserables();
        let B = findBicliques(graph)
        for (let bc of B) {
            console.log(bc)
        }
    }
)

test("findBiCliqueMB", () => {
        let graph = MBGraph();
        let B = findBicliques(graph)
        for (let bc of B) {
            console.log(bc)
        }
    }
)


