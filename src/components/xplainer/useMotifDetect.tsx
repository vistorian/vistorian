import { useEffect, useState } from "react";
import { NetworkPattern } from "./motifs/motif";
import { LinkTuple, PatternDetectors } from "./motifs/patternDetectors";
import { cloneDeep, uniqBy } from "lodash-es";
import { message } from "antd";
import { NetworkLink } from "./motifs/netpan";

// networkData records all the data
// sceneJSON records all the positions
const useMotifDectect = (networkData: any, sceneJSON: any) => {
  const [open, setOpen] = useState(false)
  const [motifs, setMotifs] = useState<NetworkPattern[]>([])
  // relocate the motif range
  const [motifsBound, setMotifsBound] = useState<any[]>([])
  const [messageApi, contextHolder] = message.useMessage()

  // get the bounds of the selected nodes & links
  const getBounds = (newVal: any) => {
    const nodesId = newVal.nodes.map((n: any) => n.id)
    const linksId = newVal.links.map((l: any) => l.id)

    const nodesToProcess: any[] = [sceneJSON]
    let bounds: any = {nodes: [], links: []}
    while (nodesToProcess.length > 0) {
      const entry = nodesToProcess.pop();

      if ("items" in entry) {
        for (const child of entry.items) {
          nodesToProcess.push(child);
          if ("id" in child ) {
            if (linksId.indexOf(child.id) > -1 && child.items.length > 0) {
              bounds.links.push(child)
            }
          }
        }
      } else {
        if (nodesId.indexOf(entry.mark.id) > -1 && entry.mark.dataset.endsWith(".nodes")) {
          bounds.nodes.push(entry);
        }
      }
    }
    return bounds
  }

  const detectMotifs = (newVal: any) => {
    // currently only allow for one vis in Learning Mode
    if (Object.keys(networkData).length > 0 && newVal.nodes.length > 0) {
      let patternDetector = new PatternDetectors(networkData)

      let nodes = newVal.nodes.map((entry: any) => entry.id)
      // TODO: due to netpan sceneJSON linkpath has two items
      let links: any[] = uniqBy(newVal.links, 'id')
      // .map((entry: any) => [entry.source.id, entry.target.id])
      console.log('nodes:', nodes, "links:", links)
      let bounds = getBounds(newVal)
      let boundsId: any
      if (bounds.nodes.length > 0) {
        boundsId = bounds.nodes.map((b: any) => b.mark.id)
      }
      console.log('bounds:', bounds)
      
      let result = patternDetector.run(nodes, links)
      if (result.length > 0) {
        setMotifs(result)
        setOpen(true)
        // get bounds for each motif
        const getMotifsBound = result.map(motif => {
          let minX1: number | null = null, maxX2: number | null = null, minY1: number | null = null, maxY2: number|null = null
          motif.nodes.forEach(nodeId => {
            let idx = boundsId.indexOf(nodeId)
            if (idx > -1) {
              let mark = bounds.nodes[idx].mark.bounds
              minX1 = minX1 ? (mark.x1 < minX1 ? mark.x1 : minX1) : mark.x1 
              minY1 = minY1 ? (mark.y1 < minY1 ? mark.y1 : minY1) : mark.y1 
              maxX2 = maxX2 ? (mark.x2 > maxX2 ? mark.x2 : maxX2) : mark.x2 
              maxY2 = maxY2 ? (mark.y2 > maxY2 ? mark.y2 : maxY2) : mark.y2 
            }
            else {
              console.log('cannot find this node in the selected nodes')
            }
          })
          if (minX1 && maxX2 && minY1 && maxY2) {
            return {x1: minX1, x2: maxX2, y1: minY1, y2: maxY2}
          }
          return null
        })
        console.log('motifs:', result)
        // console.log('motifBounds:', getMotifsBound)
        setMotifsBound(getMotifsBound)
      }
      else {
        setMotifs([])
        setOpen(false)
        if ((newVal.nodes.length > 0 || newVal.links.length > 0)) {
          // message.error('There is no motifs detected in your selection.')
          messageApi.open({
            type: 'warning',
            content: 'There is no motifs detected in your selection.'
          })
        }
      }
    }
  }
  return { open, setOpen, motifs, detectMotifs, motifsBound, contextHolder}
}


export default useMotifDectect