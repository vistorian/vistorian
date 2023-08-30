import {findFans} from "./fan";
import Graph from "graphology";
// import MBNetpanNetwork from "./templates/mb-NETPAN-static-network.json";

import MBNetpanNetwork  from "../../../../public/data/mb-NETPAN-static-network.json";
import {LinkTuple, PatternDetectors} from "./patternDetectors";
import {Hub} from "./motif";
import {MBGraph} from "./cliques.test";


test("mb", () => {
        // @ts-ignore
        let patternDetector = new PatternDetectors(MBNetpanNetwork);
        let graph = patternDetector.graph;

        let nodesIds = [
            'Charles Moruan',
            'Marie Boucher et Hubert Antheaume Cie',
            'Maude Lequere',
            'Robert Miron'
        ];

        let nodes = patternDetector.network.nodes.filter(n => nodesIds.includes(n.id));
        let links = patternDetector.network.links.filter(d => d.data.Name1 == 'Marie Boucher et Hubert Antheaume Cie' || d.data.Name2 == 'Marie Boucher et Hubert Antheaume Cie')


        // console.log(patternDetector.network.links.filter(d => d.data.Name1 == 'Marie Boucher et Hubert Antheaume Cie'))
        // let links: LinkTuple[] = [["Marie Boucher", "Hubert Antheaume"], ["Marie Boucher", "Maude Lequere"]];
        // let links = [["Marie Boucher", "Hubert Antheaume"], ["Marie Boucher", "Maude Lequere"]];

        let motifs = patternDetector.run(nodes, links);
        console.log(2, motifs)
        expect(motifs[0].type()).toEqual("Hub");
        expect(motifs[6].type()).toEqual("ParallelLinks");
        // expect(motifs[9].type()).toEqual("Clique");
        // expect(motifs[3].type()).toEqual("ParallelLinks");
    }
)