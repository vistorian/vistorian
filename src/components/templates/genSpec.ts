import { NetworkConfig } from "../../../typings"

export const genSpecFromLinkTable = (config: NetworkConfig, visType: string) => {
  const linkFileName = config.linkTableConfig?.file

  const sourceLabel = config.linkTableConfig?.sourceNodeLabel
  const targetLabel = config.linkTableConfig?.targetNodeLabel

  const timeColumn = config.linkTableConfig?.time
  const timeFormat = config.linkTableConfig?.timeFormat

  const defaultNodeType = "_default_node_type"

  const parse = timeColumn ? { 'parse': { [timeColumn]: `date:'${timeFormat}'`}} : null
  const linkTableImportSpec = {
    name: "links",
    localStorage: "UPLOADED_FILE_" + linkFileName,
    format: {
      type: "csv", // TODO: add more types
      ...parse
    },
    transform:[
      {
        "type": "calculate",
        "as": "source",
        "calculate": `datum.${sourceLabel}`
      },
      {
        "type": "calculate",
        "as": "target",
        "calculate": `datum.${targetLabel}`
      }
    ] // by default. no need to map node field to data field. just use source
  }

  if (visType === 'timearcs') {
    linkTableImportSpec.transform = [
      {
        "type": "calculate",
        "as": "source",
        "calculate": `datum.${sourceLabel} + ' (' + datum.${timeColumn} + ')'`
      },
      {
        "type": "calculate",
        "as": "target",
        "calculate": `datum.${targetLabel} + ' (' + datum.${timeColumn} + ')'`
      }
    ]
  }

  let dataSpec = [linkTableImportSpec]

  
  /**
   * @description
   * @param {string} type is this node 'source' or 'target'?
   * @return {*} 
   */
  const getNodeRawData = (type: string) => {
    const f = (type === 'source') ? sourceLabel : targetLabel
    if (visType === 'timearcs') {
      return [
        { "field": f, "as": "name" },
        { "field": timeColumn, "as": "date" }
      ]
    }
    else { // 'nodelink', 'matrix'
      return [
        { "field": f, "as": "name" },
      ]
    }
  }

  const networkSpec = {
    name: "network",
    "parts": [
      {
        "data": "links",
        "yieldsNodes" : [
          {
            "id_field": "source",
            "type": defaultNodeType,
            "data": getNodeRawData('source')
          },
          {
            "id_field": "target",
            "type": defaultNodeType,
            "data": getNodeRawData('target')
          }
        ],
        "yieldsLinks": [
          {
            "source_id": { "field": "source" },
            "source_node_type": defaultNodeType,
            "source_id_field": "id",

            "target_id": { "field": "target" },
            "target_node_type": defaultNodeType,
            "target_id_field": "id",
            
            "addReverseLinks": visType === 'matrix' ? true : false,
            "data": ["*"]
          }
        ]
      }
    ],
    "transform": [
      { "type": "metric", "metric": "degree" }
    ] as any[]
  }

  // TODO: deal with geo config, linkID
  if (config.linkTableConfig?.linkType) 
    networkSpec.transform.push({ "type": "calculate", "as": "linkType", "calculate": `datum.data.${config.linkTableConfig?.linkType}`, "for": "links" })
  if (config.linkTableConfig?.linkWeight)
    networkSpec.transform.push({ "type": "calculate", "as": "linkWeight", "calculate": `datum.data.${config.linkTableConfig?.linkWeight}`, "for": "links" })

  return {
    data: dataSpec,
    network: [networkSpec]
  }
}


// TODO: waiting for updates based on func genSpecFromLinkTable
export const genSpecFromLinkAndNodeTable = (config: NetworkConfig, visType: string) => {
  const linkFileName = config.linkTableConfig?.file

  const sourceLabel = config.linkTableConfig?.sourceNodeLabel
  const targetLabel = config.linkTableConfig?.targetNodeLabel

  const timeColumn = config.linkTableConfig?.time
  const timeFormat = config.linkTableConfig?.timeFormat

  const parse = timeColumn ? { 'parse': { [timeColumn]: `date:'${timeFormat}'` } } : null

  const linkTableImportSpec = {
    name: "links",
    localStorage: "UPLOADED_FILE_" + linkFileName,
    format: {
      type: "csv", // TODO: add more types
      ...parse
    }
  }

  let dataSpec = [linkTableImportSpec]
  if (config.extraNodeConfig?.hasExtraNode) {
    dataSpec = [
      linkTableImportSpec,
      {
        "name": "nodes",
        "localStorage": "UPLOADED_FILE_" + config.extraNodeConfig.file,
        "format": { type: "csv" }
      }
    ]
  }

  // is "id" correct default for case when only link-table used?
  const idField = config.extraNodeConfig?.hasExtraNode ? config.extraNodeConfig.nodeID : "id" 


  const networkSpec = {
    name: "network",
    links: "links",
    nodes: config.extraNodeConfig?.hasExtraNode ? "nodes" : undefined,
    directed: config.linkTableConfig?.directed,

    source_node: [sourceLabel, idField],
    target_node: [targetLabel, idField],

    transform: [
      { "type": "metric", "metric": "degree" },
    ] as any[],
  }

  // TODO: deal with geo config
  if (config.linkTableConfig?.linkType)
    networkSpec.transform.push({ "type": "calculate", "as": "linkType", "calculate": `datum.data.${config.linkTableConfig?.linkType}`, "for": "links" })
  if (config.linkTableConfig?.linkWeight)
    networkSpec.transform.push({ "type": "calculate", "as": "linkWeight", "calculate": `datum.data.${config.linkTableConfig?.linkWeight}`, "for": "links" })

  return {
    data: dataSpec,
    network: [networkSpec]
  }
}