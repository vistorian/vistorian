import { EncodingSchemes, NetworkConfig } from "../../../typings"
import csvtojson from 'csvtojson';
import { useEffect, useState } from "react";
import LegendItem from "./legendItem";

interface ILegendProps {
  config: NetworkConfig,
  schemes: EncodingSchemes
}

function Legend(props: ILegendProps) {
  const { config, schemes } = props
  const [linkTypeList, setLinkTypeList] = useState<string[]>([])
  const [nodeTypeList, setNodeTypeList] = useState<string[]>([])

  const getLinkData = async () => {
    const csvdata = window.localStorage.getItem("UPLOADED_FILE_" + config.linkTableConfig?.file) as string
    await csvtojson().fromString(csvdata)
      .then((jsonData) => {
        if (config.linkTableConfig?.linkType) {
          const list = Array.from(new Set(jsonData.map((d) => d[config.linkTableConfig?.linkType as string])))
          setLinkTypeList(list)
        }
      })
  }

  const getNodeData = async () => {
    if (config.extraNodeConfig?.hasExtraNode) {
      const csvdata = window.localStorage.getItem("UPLOADED_FILE_" + config.extraNodeConfig.file) as string
      await csvtojson().fromString(csvdata)
        .then((jsonData) => {
          // TODO: deal with multiple node types
          const nodeTypes = config.extraNodeConfig?.nodeTypes as string[]
          const list = Array.from(new Set(jsonData.map((d) => d[nodeTypes[0]])))
          setNodeTypeList(list)
        })
    }
  }

  useEffect(()=>{
    getLinkData()
    getNodeData()
  }, [])

  return (
    <div>
      <p style={{ fontSize: 18 }}><b>Legend:</b></p>
      {/* link type */}
      {config.linkTableConfig?.linkType ? <>
        <span>Link Colors:</span>
        {linkTypeList.map((linkType) => 
          <LegendItem 
            key={linkType}
            type="linkType"
            name={linkType} 
            list={linkTypeList}
            scheme={schemes.linkType}
          />
        )}
      </> : null}

      {/* node type */}
      {config.extraNodeConfig?.hasExtraNode ? <>
        <span>Node Shapes:</span>
        {nodeTypeList.map((nodeType) =>
          <LegendItem
            key={nodeType}
            type="nodeType"
            name={nodeType}
            list={nodeTypeList}
            scheme={schemes.nodeType}
          />
        )}
      </> : null}
    </div>
  )
}

export default Legend