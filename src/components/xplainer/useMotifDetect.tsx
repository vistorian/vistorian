import { useState } from "react";
import { NetworkPattern } from "./motifs/motif";
import { uniqBy } from "lodash-es";
import { message } from "antd";

// get the bounds of the selected nodes & links
// export const getBounds = (newVal: any, sceneJSON: any) => {
export const getBounds = (nodesId: any, linksId: any, sceneJSON: any) => {
  // const nodesId = newVal.nodes.map((n: any) => n.id)
  // const linksId = newVal.links.map((l: any) => l.id)

  const nodesToProcess: any[] = [sceneJSON]
  let bounds: any = { nodes: [], links: [] }
  let boundsId = { nodes: [] as string[], links: [] as string[] }

  while (nodesToProcess.length > 0) {
    const entry = nodesToProcess.pop();

    if ("items" in entry) {
      for (const child of entry.items) {
        nodesToProcess.push(child);
        if ("id" in child) {
          if (linksId.indexOf(child.id) > -1 && child.items.length > 0) {
            bounds.links.push(child)
            boundsId.links.push(`${child.id}`)
          }
        }
      }
    } else {
      if (nodesId.indexOf(entry.mark.id) > -1 && entry.mark.dataset.endsWith(".nodes")) {
        bounds.nodes.push(entry);
        boundsId.nodes.push(`${entry.mark.id}`)
      }
    }
  }
  // console.log('bounds:', bounds)
  return { bounds, boundsId }
}

// get the motif bound
export const getMotifBound = (motif: NetworkPattern, bounds: any, boundsId: any) => {
  // get bounds for each motif
  let minX1: number | null = null, maxX2: number | null = null, minY1: number | null = null, maxY2: number | null = null
  // if (motif.nodes.length > 0) {
  motif.nodes.forEach(nodeId => {
    let idx = boundsId.nodes.indexOf(nodeId)
    if (idx > -1) {
      let mark = bounds.nodes[idx].mark.bounds
      minX1 = minX1 ? (mark.x1 < minX1 ? mark.x1 : minX1) : mark.x1
      minY1 = minY1 ? (mark.y1 < minY1 ? mark.y1 : minY1) : mark.y1
      maxX2 = maxX2 ? (mark.x2 > maxX2 ? mark.x2 : maxX2) : mark.x2
      maxY2 = maxY2 ? (mark.y2 > maxY2 ? mark.y2 : maxY2) : mark.y2
    }
    // else {
    //   console.log('cannot find this node in the selected nodes')
    // }
  })
  // }
  // else {
  motif.links.forEach(linkId => {
    let idx = boundsId.links.indexOf(linkId)
    if (idx > -1) {
      let mark = bounds.links[idx].bounds
      minX1 = minX1 ? (mark.x1 < minX1 ? mark.x1 : minX1) : mark.x1
      minY1 = minY1 ? (mark.y1 < minY1 ? mark.y1 : minY1) : mark.y1
      maxX2 = maxX2 ? (mark.x2 > maxX2 ? mark.x2 : maxX2) : mark.x2
      maxY2 = maxY2 ? (mark.y2 > maxY2 ? mark.y2 : maxY2) : mark.y2
    }
    // else {
    //   console.log('cannot find this link in the selected nodes')
    // }
  })
  // }
  if (minX1 && maxX2 && minY1 && maxY2) {
    return ({ x1: minX1, x2: maxX2, y1: minY1, y2: maxY2 })
  }
  else 
    return null
}

// sceneJSON records all the positions
const useMotifDectect = (sceneJSON: any, patternDetector: any) => {
  const [open, setOpen] = useState(false)
  const [motifs, setMotifs] = useState<any[]>([])
  // relocate the motif range
  const [motifsBound, setMotifsBound] = useState<any[]>([])
  const [messageApi, contextHolder] = message.useMessage()

  // currently only allow for one vis in Learning Mode
  const detectMotifs = (newVal: any) => {
    if (Object.keys(patternDetector).length > 0 && newVal.nodes.length > 0) {
      let nodes = newVal.nodes
      let links: any[] = uniqBy(newVal.links, 'id') // bug: due to netpan sceneJSON linkpath has two items
      const nodesId = newVal.nodes.map((n: any) => n.id)
      const linksId = newVal.links.map((l: any) => l.id)
      let { bounds, boundsId } = getBounds(nodesId, linksId, sceneJSON)
      // console.log('selected nodes:', nodes, "selected links:", links)
      // console.log('selected bounds:', bounds, boundsId) // the bounds of the selected nodes and links
      let result = patternDetector.run(nodes, links)
      console.log('useHook:', result)
      
      if (result.length > 0) {
        let tmpMotifsBound: any[] = [], tmpMotifs: any[] = []
        result.forEach((motif) => {
          tmpMotifsBound.push(getMotifBound(motif, bounds, boundsId))
        })
        setMotifs(result)
        setOpen(true)
        setMotifsBound(tmpMotifsBound)
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