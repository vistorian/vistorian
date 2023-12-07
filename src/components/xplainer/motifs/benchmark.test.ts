import {PatternDetectors} from "./patternDetectors";
import MBNetpanNetwork  from "../../../../public/data/mb-NETPAN-static-network.json";
import miserablesNetpanNetwork  from "../../../../public/data/miserables-NETPAN-static-network.json";
import {MBGraph, miserables} from "./cliques.test";




test("benchmark", () => {
        for (let network of [MBNetpanNetwork, miserablesNetpanNetwork]) {
            let patternDetector = new PatternDetectors(network);

            let nodes = patternDetector.network.nodes
            let links = patternDetector.network.links
            let motifs = patternDetector.run(nodes, links);
        }
    }
)