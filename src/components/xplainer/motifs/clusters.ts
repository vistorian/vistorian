import {LinkId, NodeId} from "./patternDetectors";
import Graph from "graphology";


// No exhaustive search
export function isCluster(nodes: NodeId[], links: LinkId[], network: Graph) {
    let length = nodes.length;
    if (length < 5) return false;

    let maxNumberLinks = length * (length - 1) / 2;

    let nLinks = links.length;
    let density = nLinks / maxNumberLinks;

    return (density > 0.5) ? true : false;
}