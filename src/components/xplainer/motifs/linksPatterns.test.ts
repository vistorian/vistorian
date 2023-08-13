import Graph from "graphology";
import {MBGraph, miserables} from "./cliques.test";
import {findParallelLinks, findStrongLinks} from "./linksPatterns";

test("MB-links-patterns", () => {
        let graph: Graph = MBGraph();
        let parallelLinks = findParallelLinks(graph);

        for (let pa of parallelLinks) {
            console.log(pa)
        }
    }
)

test("Miserables", () => {
        let graph: Graph = miserables();
        let strongLinks = findStrongLinks(graph);
        for (let sl of strongLinks) {
            console.log(sl)
        }
    }
)