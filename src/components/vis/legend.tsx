import { NetworkConfig } from "../../../typings"
import LegendItem from "./legendItem";

interface ILegendProps {
  config: NetworkConfig,
  linkTypeEncoding: string | string[],
  nodeTypeEncoding: string | string[],
  nodeTypeInShape: boolean
}

function Legend(props: ILegendProps) {
  const { config, linkTypeEncoding, nodeTypeEncoding, nodeTypeInShape } = props

  const getLinkData = () => {
    const jsonData = JSON.parse(window.localStorage.getItem("UPLOADED_FILE_" + config.linkTableConfig?.file) as string)
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
      const jsonData = JSON.parse(window.localStorage.getItem("UPLOADED_FILE_" + config.extraNodeConfig.file) as string)
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
        <span>Link Types:</span>
        {linkTypeList.map((linkType) => 
          <LegendItem 
            key={linkType}
            type="linkColor"
            name={linkType} 
            list={linkTypeList}
            scheme={linkTypeEncoding}
          />
        )}
      </> : null}

      {/* node type */}
      {(config.extraNodeConfig?.hasExtraNode)  ? <>
        <span>Node Types:</span>
        {nodeTypeList.map((nodeType) =>
          <LegendItem
            key={nodeType}
            type={nodeTypeInShape ? "nodeShape" : "nodeColor"}
            name={nodeType}
            list={nodeTypeList}
            scheme={nodeTypeEncoding}
          />
        )}
      </> : null}
    </div>
  )
}

export default Legend