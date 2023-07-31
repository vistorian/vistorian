import { useEffect, useState } from "react";
import { NetworkPattern } from "./motifs/motif";
import { LinkTuple, PatternDetectors } from "./motifs/patternDetectors";
import { uniqBy } from "lodash-es";
import { message } from "antd";

const useMotifDectect = (networkData: any) => {
  const [open, setOpen] = useState(false)
  const [motifs, setMotifs] = useState<NetworkPattern[]>([])
  const [messageApi, contextHolder] = message.useMessage()

  const detectMotifs = (newVal: any) => {
    console.log('detectMotifs:', newVal)

    // currently only allow for one vis in Learning Mode
    if (Object.keys(networkData).length > 0) {
      let patternDetector = new PatternDetectors({ nodes: networkData.nodes, links: networkData.links })

      let nodes = newVal.nodes.map((entry: any) => entry.id)
      // TODO: due to netpan sceneJSON linkpath has two items
      let links: LinkTuple[] = uniqBy(newVal.links, 'id').map((entry: any) => [entry.source.id, entry.target.id])
      let result = patternDetector.run(nodes, links)
      if (result.length > 0) {
        setMotifs(result)
        setOpen(true)
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
      console.log('motifs:', result)
    }
  }
  return { open, setOpen, motifs, detectMotifs, contextHolder}
}


export default useMotifDectect