import {findFans} from "./fan";
import Graph from "graphology";
import MBNetpanNetwork from "./templates/mb-NETPAN-static-network.json";
import {LinkTuple, PatternDetectors} from "./patternDetectors";
import {Hub} from "./motif";


test("mb", () => {
        // @ts-ignore
        let patternDetector = new PatternDetectors(MBNetpanNetwork);

        let nodes = [
            'Charles Moruan',
            'Marie Boucher et Hubert Antheaume Cie',
            'Maude Lequere'
        ]
        let links: LinkTuple[] = [["Marie Boucher", "Hubert Antheaume"], ["Marie Boucher", "Maude Lequere"]];

        let motifs = patternDetector.run(nodes, links);
        expect(motifs[0].type()).toEqual("Hub");
        expect(motifs[1].type()).toEqual("Clique");
    }
)