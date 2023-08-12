import {LinkId, NodeId} from "./patternDetectors";
import Graph from "graphology";


// No exhaustive search
export function isCluster(nodes: NodeId[], links: LinkId[], network: Graph) {
    let length = nodes.length;
    let maxNumberLinks = length ** 2;

    let nLinks = links.length;
    let density = nLinks / maxNumberLinks;

    return (density > 0.5) ? true : false;
}