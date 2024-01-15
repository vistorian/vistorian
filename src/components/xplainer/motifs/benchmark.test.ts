import {PatternDetectors} from "./patternDetectors";
import {union} from "./bicliques";
import MBNetpanNetwork  from "../../../../public/data/mb-NETPAN-static-network.json";
import miserablesNetpanNetwork  from "../../../../public/data/miserables-NETPAN-static-network.json";
import piemontNetwork  from "../../../../public/data/piemont-NETPAN-static-network.json";
import piemontBipartiteNetwork  from "../../../../public/data/piemont-NETPAN-bipartite-network.json";
import davisNetwork  from "../../../../public/data/Davis-netpan-static-network.json";

import diseaseNetwork  from "../../../../public/data/DISEASOME-NETPAN-static-network.json";
import {MBGraph, miserables} from "./cliques.test";

var fs = require('fs');


test("benchmark", () => {
        let i = 0;

        let datasetNames = ["Marie Boucher", "Disease", "Piemont"];
        for (let network of [MBNetpanNetwork, diseaseNetwork, piemontBipartiteNetwork]) {
        // for (let network of [miserablesNetpanNetwork, MBNetpanNetwork, piemontBipartiteNetwork, diseaseNetwork]) {
        // for (let network of [davisNetwork]) {
        // for (let network of [davisNetwork, miserablesNetpanNetwork, MBNetpanNetwork, diseaseNetwork]) {
            console.log(i)
            console.log("STATS ", network.nodes.length, network.links.length)
            let patternDetector = new PatternDetectors(network, null, true);

            // let nodes = patternDetector.network.nodes;
            // let links = patternDetector.network.links;

            // let motifs = patternDetector.run(nodes, links);
            // let motifs = patternDetector.getAll();

            let motifs = patternDetector.allMotifs;
            console.log("motifs ", Object.entries(motifs).map(m => [m[0], m[1].length]))
            let bicliques = motifs["BiClique"]
            if (bicliques) {
                let bicliqueSets = bicliques.map(bc => bc.sets())

                require('fs').writeFile(`./${datasetNames[i]}_bcs.json`,
                JSON.stringify(bicliqueSets),
                function (err) {
                    if (err) {
                        console.error('Crap happens');
                    }
                });

                let N = bicliques.filter(bc => bc.isBig()).length;

                require('fs').writeFile(`./${datasetNames[i]}_Nbcs.json`,
                JSON.stringify(N),
                function (err) {
                    if (err) {
                        console.error('Error');
                    }
                });
            }

            i++;
        }
    }
)



test("ptest", () => {
        let N = 20000000;

        let a = [1,2,3]
        let b = [4,5,2,1]

        let map = new Map()
        for (let i = 0; i < N; i++) {
            let c = `FUNCTION${a}${b}`
            if (map.has(c)) {
                let r = map.get(c)
                continue;
            }

            map.set(c, i);
        }
    }
)

test("ptest2", () => {
        let N = 20000000;

        let a = [1,2,3]
        let b = [4,5,2,1]

        for (let i = 0; i < N; i++) {
            let c = union(a, b);
        }
    }
)