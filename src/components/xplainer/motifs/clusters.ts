import {LinkId, NodeId} from "./patternDetectors";
import Graph from "graphology";
import louvain from 'graphology-communities-louvain';
import {Cluster, ClusterSubset} from "./motif";


// No exhaustive search
export function isClusterFromDensity(nodes: NodeId[], links: LinkId[], network: Graph) {
    let length = nodes.length;
    if (length < 5) return false;

    let maxNumberLinks = length * (length - 1) / 2;

    let nLinks = links.length;
    let density = nLinks / maxNumberLinks;

    return (density > 0.5 && density < 1) ? true : false;
}


export function isCluster(nodes: NodeId[], links: LinkId[], network: Graph) {
    let c = findClusters(network);
    for (let clu of c) {
        const intersection = nodes.filter(value => clu.nodes.includes(value));
        if  ((intersection.length / clu.nodes.length) == 1) {
            return new Cluster(nodes);
        } else if ((intersection.length / clu.nodes.length) > 0.5) {
            return new ClusterSubset(nodes);
        }
    }
    return null;
}


type NodeGroup = { [attrValue: string]: string[] };

export function* findClusters(network: Graph) {
    // To directly assign communities as a node attribute
    louvain.assign(network);

    let groups: NodeGroup = {};

    network.forEachNode((node, attributes) => {
        const attrValue = attributes.community;

        if (attrValue !== undefined) {
            if (!groups[attrValue]) {
                groups[attrValue] = [];
            }
            groups[attrValue].push(node);
        }
    });

    for (let [community, nodes] of Object.entries(groups)) {

        let length = nodes.length;
        let maxNumberLinks = length * (length - 1) / 2;
        let nLinks = links.length;

        let links: any[] = [];
        for (let link of network.edges()) {
            let [s, t] = network.extremities(link);
            if (nodes.includes(s) || nodes.includes(t)) {
                links.push(link);
            }
        }

        let density = links.length / maxNumberLinks;

        yield new Cluster(nodes, density);
    }
}