import {PatternDetectors} from "./patternDetectors";
import MBNetpanNetwork  from "../../../../public/data/mb-NETPAN-static-network.json";
import miserablesNetpanNetwork  from "../../../../public/data/miserables-NETPAN-static-network.json";
import piemontNetwork  from "../../../../public/data/piemont-NETPAN-static-network.json";
import piemontBipartiteNetwork  from "../../../../public/data/piemont-NETPAN-bipartite-network.json";

import diseaseNetwork  from "../../../../public/data/DISEASOME-NETPAN-static-network.json";
import {MBGraph, miserables} from "./cliques.test";


test("benchmark", () => {
        let i = 0;
        for (let network of [piemontBipartiteNetwork, miserablesNetpanNetwork, MBNetpanNetwork, diseaseNetwork]) {
        // for (let network of [miserablesNetpanNetwork, MBNetpanNetwork, piemontBipartiteNetwork, diseaseNetwork]) {
        // for (let network of [miserablesNetpanNetwork, MBNetpanNetwork, diseaseNetwork]) {
            console.log(i)
            console.log("STATS ", network.nodes.length, network.links.length)
            let patternDetector = new PatternDetectors(network);

            // let nodes = patternDetector.network.nodes;
            // let links = patternDetector.network.links;

            // let motifs = patternDetector.run(nodes, links);
            // let motifs = patternDetector.getAll();

            let motifs = patternDetector.allMotifs;
            console.log("motifs ", Object.entries(motifs).map(m => [m[0], m[1].length]))

            i++;
        }
    }
)