import Graph from "graphology";
import {MBGraph, miserables} from "./cliques.test";
import {findParallelLinks, findStrongLinks} from "./linksPatterns";
import {findBursts, findRepeatedLinksAndBFonDynNetPan} from "./dynamicMotifs";

test("MB-links-patterns", () => {
        let graph: Graph = MBGraph();
        let bursts = findBursts(graph);

        for (let b of bursts) {
            console.log(b)
        }
    }
)

// test("MB-backandforth", () => {
//         let graph: Graph = MBGraph();
//         let motifs = findRepeatedLinksAndBFonDynNetPan(graph);
//
//         for (let m of motifs) {
//             console.log(b)
//         }
//     }
// )