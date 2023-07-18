// import {Network} from "./netpan";
import Graph from "graphology";
import {Connector} from "./motif";
import {NodeId} from "./patternDetectors";


export function* findConnectors(network: Graph, dMin=2, dMax= 8) {
    let nodes = network.nodes();
    let found: Record<string, Connector> = {}

    detectLoop:
    for (let node of nodes) {
        let neighbors = network.neighbors(node);
        let l = neighbors.length;
        if (l >= dMin && l <= dMax) {
            for (let n2 of neighbors) {
                if (network.neighbors(n2).length < 2) {
                    continue detectLoop;
                }

                neighbors.sort();
                addSpan(neighbors, node, found, network);
            }
        }
    }

    let out = new Set();
    let used: Record<NodeId, Connector> = {};

    filterloop:
    for (let c of Object.values(found)) {
        if (c.spanners.length >= 2) {
            for (let spanner of c.spanners) {
                if (Object.keys(used).includes(spanner)) {
                    let c2 = used[spanner];
                    let cTotal = c.spanners.length + c.anchors.length;
                    let c2Total = c2.spanners.length + c2.anchors.length;
                    if ((cTotal >= c2Total) || (cTotal == c2Total && c.spanners.length > c2.spanners.length)) {
                        out.delete(c2);

                        c2.nodes.forEach(n => {
                            delete used[n];
                        })
                        addConnector(out, used, c);
                    }
                    continue filterloop;
                }
            }
            addConnector(out, used, c)
        }
    }
    for (let c of out) {
        yield c as Connector
    }
}

function addSpan(anchors, spanner, found, network) {
    let key = anchors.toString();
    if (!found[key]) {
        found[key] = new Connector([], network);
        found[key].addAnchors(anchors);
    }
    found[key].addSpanner(spanner);
}

function addConnector(out: Set<any>, used: Record<string, any>, c: Connector) {
    out.add(c)
    for (let node of c.nodes) {
        used[node] = c;
    }
    for (let anchor of c.nodes) {
        used[anchor] = c;
    }
}