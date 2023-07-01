// @ts-ignore
import { read } from "vega-loader"
import { EncodingSchemes, NetworkConfig } from "../../../typings"
import { useEffect, useState } from "react";
import LegendItem from "./legendItem";
import csvtojson from 'csvtojson'

interface ILegendProps {
  config: NetworkConfig,
  schemes: EncodingSchemes
}

function Legend(props: ILegendProps) {
  const { config, schemes } = props

  const getLinkData = () => {
    const csvdata = window.localStorage.getItem("UPLOADED_FILE_" + config.linkTableConfig?.file) as string
    const jsonData = read(csvdata, { type: 'csv' })
    if (config.linkTableConfig?.linkType) {
      let list = Array.from(new Set(jsonData.map((d: any) => d[config.linkTableConfig?.linkType as string])))
      list = list.map(l => l==='' ? 'undefined': l)
      return list as string[]
    }
    return []
  }
  const linkTypeList = getLinkData()

  const getNodeData = () => {
    if (config.extraNodeConfig?.hasExtraNode) {
      const csvdata = window.localStorage.getItem("UPLOADED_FILE_" + config.extraNodeConfig.file) as string
      const jsonData = read(csvdata, { type: 'csv' })
      // TODO: deal with multiple node types
      const nodeTypes = config.extraNodeConfig?.nodeTypes as string[]
      let list = Array.from(new Set(jsonData.map((d: any) => d[nodeTypes[0]])))
      list = list.map(l => l === '' ? 'undefined' : l)
      return list as string[]
    }
    return []
  }
  const nodeTypeList = getNodeData()

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