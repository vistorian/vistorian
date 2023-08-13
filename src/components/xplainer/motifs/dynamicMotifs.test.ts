import Graph from "graphology";
import {MBGraph, miserables} from "./cliques.test";
import {findParallelLinks, findStrongLinks} from "./linksPatterns";
import {findBursts} from "./dynamicMotifs";

test("MB-links-patterns", () => {
        let graph: Graph = MBGraph();
        let bursts = findBursts(graph);

        for (let b of bursts) {
            console.log(b)
        }
    }
)